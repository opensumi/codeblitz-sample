import { Injectable, Provider } from '@opensumi/di';
import { BrowserModule } from '@opensumi/ide-core-browser';
import { extendModule, ModuleConstructor } from '@codeblitzjs/ide-sumi-core';
// import { CompletionItemKind, CompletionProviderOptions, supportLanguage } from './types';
import { ISQLServiceConfig } from './sql-service.configuration';
import { SqlServiceContribution } from './sql-service.contribution';
import { SQLKeybindContribution } from './sql-keybinding.contribution';
import { CompletionItemKind } from "@opensumi/ide-extension/lib/common/vscode/ext-types";

const defaultConfig: any = {
  lowerCaseComplete: true,
  sorter: {
    TABLE: 'c',
    TABLEALIAS: 'c',
    FIELD: 'd',
    FIELDALIAS: 'd',
    KEYWORD: 'e',
    CONSTS: 'e',
    FUNCTION: 'f',
    DEFAULT: 'g',
  },
  completionTypes: {
    KEYWORD: {
      text: '关键词',
      kind: CompletionItemKind.Keyword,
    },
    CONSTS: {
      text: '常量',
      kind: CompletionItemKind.Snippet,
    },
    FUNCTION: {
      text: '函数',
      kind: CompletionItemKind.Function,
    },
    TABLE: {
      text: '表名',
      kind: CompletionItemKind.Method,
    },
    TABLEALIAS: {
      text: '表别名',
      kind: CompletionItemKind.Method,
    },
    SNIPPET: {
      text: '代码块',
      kind: CompletionItemKind.Snippet,
    },
    FIELD: {
      text: '表字段',
      kind: CompletionItemKind.Field,
    },
    FIELDALIAS: {
      text: '表字段别名',
      kind: CompletionItemKind.Field,
    },
  },

};

function mergeObjects(...objects) {
  return objects.reduce((result, object) => {
    Object.keys(object).forEach(key => {
      if (typeof object[key] === 'object' && object[key] !== null) {
        result[key] = mergeObjects(result[key] || {}, object[key]);
      } else {
        result[key] = object[key];
      }
    });
    return result;
  }, {});
}

@Injectable()
export class SqlServiceModule extends BrowserModule {
  static Config(config: any): ModuleConstructor {
    return extendModule({
      module: SqlServiceModule,
      providers: [
        {
          token: ISQLServiceConfig,
          useValue: mergeObjects(defaultConfig, config),
        },
      ],
    });
  }

  providers: Provider[] = [SqlServiceContribution, SQLKeybindContribution];
}