import { Injectable, Autowired } from '@opensumi/di';
import {
  Domain,
  ClientAppContribution,
  IClientApp,
  MaybePromise,
  URI,
  WithEventBus,
} from '@opensumi/ide-core-browser';
import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';
import { ITextmateTokenizer } from '@opensumi/ide-monaco/lib/browser/contrib/tokenizer';
import type { ITextmateTokenizerService } from '@opensumi/ide-monaco/lib/browser/contrib/tokenizer';
import { ISQLServiceConfig } from './sql-service.configuration';

// import type { CompletionProviderOptions } from '../types';
import { AppConfig, RuntimeConfig } from '@codeblitzjs/ide-sumi-core';

import { IFileServiceClient, FileChangeType } from '@opensumi/ide-file-service/lib/common';
import * as path from 'path';
import { WorkbenchEditorServiceImpl } from '@opensumi/ide-editor/lib/browser/workbench-editor.service';
import { WorkbenchEditorService } from '@opensumi/ide-editor';
import {
  BrowserEditorContribution,
  IEditorDocumentModelService,
} from '@opensumi/ide-editor/lib/browser';
import { PreferenceService } from '@opensumi/ide-core-browser';

@Injectable()
@Domain(ClientAppContribution, BrowserEditorContribution)
export class SqlServiceContribution
  extends WithEventBus
  implements ClientAppContribution, BrowserEditorContribution
{
  @Autowired(ISQLServiceConfig)
  sqlConfig: any;

  @Autowired(ITextmateTokenizer)
  textmateService: ITextmateTokenizerService;

  @Autowired(AppConfig)
  appConfig: AppConfig;

  @Autowired(RuntimeConfig)
  runtimeConfig: RuntimeConfig;

  @Autowired(IFileServiceClient)
  fileService: IFileServiceClient;

  @Autowired(WorkbenchEditorService)
  private readonly editorService: WorkbenchEditorServiceImpl;

  @Autowired(PreferenceService)
  private readonly preferenceService: PreferenceService;

  @Autowired(IEditorDocumentModelService)
  private editorDocumentModelService: IEditorDocumentModelService;

  initialize() {
    type EventType = { uri: string; filepath: string };
    this.addDispose(
      this.fileService.onFilesChanged((changes) => {
        const changed: EventType[] = [];

        for (const change of changes) {
          const relativePath = this.getWorkspaceRelativePath(new URI(change.uri));
          if (relativePath === null) {
            continue;
          }
          const obj: EventType = { uri: change.uri, filepath: relativePath };
          switch (change.type) {
            case FileChangeType.UPDATED:
              changed.push(obj);
              break;
            default:
              break;
          }
        }
        if (changed.length && this.sqlConfig?.onChange) {
          // TODO: 直接返回 buffer? 编码假定为 utf8 了
          Promise.all(
            changed.map(async ({ uri, filepath }) => {
              const { content } = await this.fileService.resolveContent(uri);
              return {
                filepath,
                content,
              };
            })
          )
            .then((data) => {
              this.sqlConfig.onChange?.(data);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      })
    );
  }

  onDidRestoreState() {
    this.addDispose(
      this.preferenceService.onPreferencesChanged((e) => {
        const encoding = e['files.encoding'];
        if (encoding && encoding.newValue !== encoding.oldValue) {
          const resource = this.editorService.currentResource;
          if (resource) {
            this.editorDocumentModelService.changeModelOptions(resource.uri, {
              encoding: encoding.newValue,
            });
          }
        }
      })
    );
  }

  getWorkspaceRelativePath(uri: URI): string | null {
    const absolutePath = uri.codeUri.path;
    const { workspaceDir } = this.appConfig;
    if (!absolutePath.startsWith(workspaceDir)) {
      return null;
    }
    return path.relative(this.appConfig.workspaceDir, absolutePath);
  }
}
