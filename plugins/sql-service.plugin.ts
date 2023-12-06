import { IPluginAPI, IPluginModule } from '@codeblitzjs/ide-core';

import * as monaco from '@opensumi/monaco-editor-core/esm/vs/editor/editor.api';


interface completionTypeStruct {
  text: string;
  kind: monaco.languages.CompletionItemKind;
}

export interface SqlServiceConfig {
  // 基础配置项 目前只提供最基础的配置项 后续能力可以暴露出来
  // 大小写配置 默认为false
  lowerCaseComplete?: boolean;
  completionTypes?: {
    KEYWORD: completionTypeStruct;
    CONSTS: completionTypeStruct;
    FUNCTION: completionTypeStruct;
    TABLE: completionTypeStruct;
    TABLEALIAS: completionTypeStruct;
    FIELD: completionTypeStruct;
    FIELDALIAS: completionTypeStruct;
    [key: string]: completionTypeStruct;
  };
  sorter?: {
    KEYWORD: string;
    CONSTS: string;
    FUNCTION: string;
    TABLE: string;
    TABLEALIAS: string;
    FIELD: string;
    FIELDALIAS: string;
    DEFAULT: string;
    [key: string]: string;
  };
}

export type TablesCallback = (
  prefix: string,
  options?: { [key: string]: any }
) =>
  | Promise<Array<Partial<monaco.languages.CompletionItem>>>
  | Array<Partial<monaco.languages.CompletionItem>>;

export type FieldsCallback = (
  prefix: string,
  options?: { [key: string]: any }
) =>
  | Promise<Array<Partial<monaco.languages.CompletionItem>>>
  | Array<Partial<monaco.languages.CompletionItem>>;

export type ChangeCallback = (path: string, data: string) => void;

export default class SQLServicePlugin implements IPluginModule {
  PLUGIN_ID = 'SQL_SERVICE';

  private _commands: IPluginAPI['commands'] | null = null;

  private _ready: boolean = false;

  get commands() {
    return this._commands;
  }

  get ready() {
    return this._ready;
  }

  private config: SqlServiceConfig;

  private onSuggestTables: TablesCallback;

  private onSuggestFields: FieldsCallback;

  private onChange: ChangeCallback;

  constructor(
    config: SqlServiceConfig,
    onSuggestTables: TablesCallback,
    onSuggestFields: FieldsCallback,
    onChange: ChangeCallback
  ) {
    this.config = config;
    this.onSuggestTables = onSuggestTables;
    this.onSuggestFields = onSuggestFields;
    this.onChange = onChange;
  }

  async activate({ context, commands }: IPluginAPI) {
    this._commands = commands;
    context.subscriptions.push(
      commands.registerCommand('sql-service.ob.config', async () => {
        return this.config;
      }),
      commands.registerCommand('sql-service.ob.onSuggestTables', async (prefix, options) => {
        return this.onSuggestTables(prefix, options);
      }),
      commands.registerCommand('sql-service.ob.onSuggestFields', async (prefix, options) => {
        return this.onSuggestFields(prefix, options);
      }),
    );
  }

  deactivate() {
    this._commands = null;
  }
}
