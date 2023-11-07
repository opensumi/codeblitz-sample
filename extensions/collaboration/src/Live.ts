import {
  ExtensionContext,
  workspace,
  commands,
  WorkspaceEdit,
  TextEdit,
  Range,
  Uri,
  window,
  ViewColumn,
  TextEditor,
  EndOfLine,
  Selection,
  languages,
  TextDocumentChangeEvent,
} from 'vscode';
import debounce from 'lodash.debounce';

import { convertChangeEventToOperation } from './event-to-transform';
import { TextOperation } from './ot';
import { OTClient } from './OTClient';
import { log, logError, logWarn, t, report } from './utils';
import {
  LIVE_COMMAND,
  InitializeState,
  ApplyOperationType,
  ApplySelectionType,
  SendOperationType,
  UserProfile,
  PREFERENCE_COMMAND,
  DocState,
  REPORT_NAME,
} from './types';
import { DecoratorManager, NameTagVisibility } from './decorators';
import { UsersManager } from './UsersManager';

export class Live {
  private otClient: OTClient;

  private usersManager: UsersManager;

  private isApplyingOperation: boolean = false;

  private docUri: Uri;

  private editor: TextEditor;

  private code = '';

  // 是否可编辑，在 editor 未初始化或 rollback 时编辑的内容会被丢弃
  private editable = false;

  /**
   * 远程 operation 缓存队列
   */
  private remoteOperationsQueue: ApplyOperationType[] = [];
  /**
   * 本地 edit changes 队列
   */
  private localChangesQueue: TextDocumentChangeEvent[] = [];

  private onSelectionChangeDebounced: ((selections: ReadonlyArray<Selection>) => void) & {
    cancel(): void;
  };

  private decorationsManagers: Record<number, DecoratorManager> = {};

  constructor(context: ExtensionContext) {
    this.onSelectionChangeDebounced = debounce(this.onSelectionChanged, 200);
  }

  async initialize(docUri: Uri) {
    const initState = await commands.executeCommand<InitializeState>(LIVE_COMMAND.Initialize);

    if (!initState) {
      return Promise.reject('initialize data is undefined');
    }

    if (initState.status === 'fail') {
      // 表示初始化失败，此时不初始化 editor
      return;
    }

    const { data } = initState;

    this.usersManager = new UsersManager({
      userId: data.userId,
      name: data.name,
    });

    this.otClient = new OTClient(data.revision || 0, this.onSendOperation, this.onApplyOperation);

    this.code = data.code;
    this.docUri = docUri;
    await workspace.fs.writeFile(docUri, Uint8Array.from([]), {
      create: true,
      overwrite: true,
    });
    const doc = await workspace.openTextDocument(docUri);
    this.editor = await window.showTextDocument(doc, {
      viewColumn: ViewColumn.One,
      preserveFocus: true,
      preview: false,
    });
    if (data.mode) {
      languages.setTextDocumentLanguage(doc, data.mode);
    }
    const edit = new WorkspaceEdit();
    edit.replace(
      docUri,
      new Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end),
      data.code
    );
    await workspace.applyEdit(edit);

    this.startListen();

    this.editable = true;

    commands.executeCommand(LIVE_COMMAND.Initialized);
  }

  async startListen() {
    workspace.onDidChangeTextDocument((event) => {
      if (event.document.uri.toString() !== this.docUri.toString()) {
        return;
      }

      this.localChangesQueue.push(event);
      this.processQueuedMessages();
    });

    window.onDidChangeTextEditorSelection(({ selections }) => {
      if (this.isApplyingOperation) {
        return;
      }
      this.onSelectionChangeDebounced.cancel();
      this.onSelectionChangeDebounced(selections);
    });

    commands.registerCommand(PREFERENCE_COMMAND.Language, (mode) => {
      return languages.setTextDocumentLanguage(this.editor.document, mode || 'plaintext');
    });

    commands.registerCommand(LIVE_COMMAND.Join, (user: UserProfile) => {
      this.usersManager.addUser(user);
    });

    commands.registerCommand(LIVE_COMMAND.Leave, (userId: number) => {
      this.usersManager.removeUser(userId);
      this.usersManager.removeSelection(userId);
      const decoration = this.decorationsManagers[userId];
      if (decoration) {
        decoration.dispose();
        delete this.decorationsManagers[userId];
      }
    });

    commands.registerCommand(LIVE_COMMAND.Reconnect, () => {
      this.syncState('reconnect');
    });

    commands.registerCommand(LIVE_COMMAND.ApplyOperation, (data: ApplyOperationType) => {
      this.remoteOperationsQueue.push(data);
      this.processQueuedMessages();
    });

    commands.registerCommand(LIVE_COMMAND.ApplySelection, (data: ApplySelectionType) => {
      const { userId, selection } = data;
      const { document: doc } = this.editor;
      const { name } = this.usersManager.getUser(userId)!;
      if (selection) {
        this.usersManager.setSelection(
          userId,
          selection.map((item) => ({
            range: new Range(doc.positionAt(item.offset[0]), doc.positionAt(item.offset[1])),
            isReversed: item.isReversed,
          }))
        );
      }
      if (!this.decorationsManagers[userId]) {
        this.decorationsManagers[userId] = new DecoratorManager(
          userId,
          name,
          NameTagVisibility.Activity,
          this.usersManager,
          this.editor
        );
      }
      this.decorationsManagers[userId].updateDecorators();
    });

    commands.registerCommand(LIVE_COMMAND.UpdateUser, ({ userId, name }: UserProfile) => {
      if (!this.decorationsManagers[userId]) {
        this.decorationsManagers[userId] = new DecoratorManager(
          userId,
          name,
          NameTagVisibility.Activity,
          this.usersManager,
          this.editor
        );
      } else {
        this.decorationsManagers[userId].updateNameTag(name);
      }
    });
  }

  private processQueuedMessages() {
    if (!this.editable) {
      logWarn("can't edit before sync code from server");
      return;
    }

    if (this.isApplyingOperation) {
      log('applying operation');
      return;
    }

    const { localChangesQueue } = this;
    this.localChangesQueue = [];
    while (localChangesQueue.length > 0) {
      let localChange = localChangesQueue.shift()!;
      this.acceptLocalChange(localChange);
    }

    if (this.remoteOperationsQueue.length) {
      this.applyingRemoteChange(this.remoteOperationsQueue[0]);
    }
  }

  private acceptLocalChange(e: TextDocumentChangeEvent) {
    const { operation } = convertChangeEventToOperation(e.contentChanges, this.code);
    this.sendCodeUpdate(operation);
    this.code = this.editor.document.getText();
  }

  private applyingRemoteChange(data: ApplyOperationType) {
    try {
      this.otClient.applyServer(TextOperation.fromJSON(data.ops));
    } catch (err) {
      // 同步失败，可能中间丢失了某写版本，需重新拉取最新版本
      logError('同步 ot 操作失败');
      logError({
        category: 'ot',
        message: `Apply operation from server to OT client failed ${JSON.stringify(data)}`,
      });
      this.syncState(err);
    }
  }

  private async syncState(err: Error | string) {
    report(REPORT_NAME.SyncState, typeof err === 'string' ? err : err?.message || 'Unknown');
    try {
      this.editable = false;
      const docState: DocState | undefined = await commands.executeCommand(LIVE_COMMAND.SyncState);
      if (!docState) {
        throw new Error('doc is empty');
      }
      this.otClient.reset(docState.revision);
      const {
        docUri,
        editor: { document: doc },
      } = this;
      const edit = new WorkspaceEdit();
      edit.replace(
        docUri,
        new Range(doc.lineAt(0).range.start, doc.lineAt(doc.lineCount - 1).range.end),
        docState.code
      );
      // 保留上次 selections
      const currentSelections = this.editor.selections;
      await workspace.applyEdit(edit);
      this.editor.selections = currentSelections;
      this.code = doc.getText();

      this.localChangesQueue.length = 0;
      this.remoteOperationsQueue.length = 0;
      this.editable = true;
    } catch (err) {
      this.editable = true;
      window.showErrorMessage(
        t(['Sync code error, please refresh browser', '同步代码失败，请刷新浏览器'])
      );
      report(REPORT_NAME.SyncStateFail);
    }
  }

  private onSelectionChanged(selections: ReadonlyArray<Selection>) {
    const { document: doc } = this.editor;
    const data = selections.map((selection) => ({
      offset: [doc.offsetAt(selection.anchor), doc.offsetAt(selection.active)],
      isReversed: selection.isReversed,
    }));
    commands.executeCommand(LIVE_COMMAND.SendSelection, { selection: data });
  }

  private onSendOperation = async (revision: number, operation: TextOperation) => {
    log({
      category: 'ot',
      message: `Sending ${JSON.stringify({
        revision,
        operation,
      })}`,
    });

    try {
      await commands.executeCommand<SendOperationType>(LIVE_COMMAND.SendOperation, {
        revision,
        ops: operation.toJSON(),
      });
    } catch (err) {
      this.syncState(err);
      throw err;
    }
  };

  private onApplyOperation = async (operation: TextOperation) => {
    this.isApplyingOperation = true;
    try {
      await this.applyOperationToModel(operation, false);
      this.remoteOperationsQueue.shift();
      // 丢弃因 apply operation 引起的本地变更
      this.localChangesQueue.shift();
      this.isApplyingOperation = false;
      this.code = this.editor.document.getText();
      this.processQueuedMessages();
    } catch (err) {
      logError('applying edits failed', err);
      this.isApplyingOperation = false;
      this.syncState(err);
    }
  };

  private async applyOperationToModel(operation: TextOperation, pushStack = false) {
    const { document: doc } = this.editor;
    const edit = new WorkspaceEdit();

    let index = 0;
    const { eol: currentEOL } = doc;
    let eolChanged = false;
    const modelCode = doc.getText();

    if (operation.baseLength !== modelCode.length) {
      throw new Error("The base length of the operation doesn't match the length of the code");
    }

    for (let i = 0; i < operation.ops.length; i++) {
      const op = operation.ops[i];
      if (TextOperation.isRetain(op)) {
        index += op as number;
      } else if (TextOperation.isInsert(op)) {
        const textOp = op as string;
        const position = doc.positionAt(index);
        edit.insert(this.docUri, position, textOp);

        // if there's a new line
        if (/\n/.test(textOp)) {
          const eol = /\r\n/.test(textOp) ? EndOfLine.CRLF : EndOfLine.LF;
          if (eol !== currentEOL) {
            // With this insert the EOL of the document changed on the other side. We need
            // to accomodate our EOL to it.
            eolChanged = true;
          }
        }
      } else if (TextOperation.isDelete(op)) {
        const delOp = op as number;
        const from = doc.positionAt(index);
        const to = doc.positionAt(index - delOp);
        edit.delete(this.docUri, new Range(from, to));
        index -= delOp;
      }
    }

    if (eolChanged) {
      edit.set(this.docUri, [
        TextEdit.setEndOfLine(currentEOL === EndOfLine.CRLF ? EndOfLine.LF : EndOfLine.CRLF),
      ]);
    }

    await workspace.applyEdit(edit);
    // await doc.save();
  }

  sendCodeUpdate(operation: TextOperation) {
    if (!operation) {
      return;
    }

    if (operation.ops.length === 1) {
      const [op] = operation.ops;
      if (typeof op === 'number' && op >= 0) {
        // Useless to send a single retain operation, ignore
        return;
      }
    }

    try {
      this.otClient.applyClient(operation);
    } catch (e) {
      e.name = 'OperationFailure';
      logError(e);
      this.syncState(e);
    }
  }
}
