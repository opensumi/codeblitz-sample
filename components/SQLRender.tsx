import { AppRenderer, SlotLocation } from "@codeblitzjs/ide-core";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import "@codeblitzjs/ide-core/languages/sql";
import { CompletionItemKind } from "@opensumi/ide-extension/lib/common/vscode/ext-types";
import SQLServicePlugin, {
  SqlServiceConfig,
} from "../plugins/sql-service.plugin";
import * as SQLPlugin from "../plugins/sql-plugin";

import { Popover, Radio } from "antd";
import "antd/dist/antd.css";
import { Button } from "@opensumi/ide-components";
import * as monaco from "@opensumi/monaco-editor-core/esm/vs/editor/editor.api";

import { KeepAlive } from "./KeepAlive";
import { SqlServiceModule } from "../modules/sql/index.module";

let tableID = 1;

const tableMap = {
  1: [],
  2: [],
};

export const SQLRender = (props) => {
  const id = useRef(props.id);
  const suggestTables = useRef(tableMap);

  useEffect(() => {
    id.current = props.id;
  }, [props.id]);

  function changeTables() {
    tableID++;
    suggestTables.current[id.current] = suggestTables.current[
      id.current
    ].concat([
      {
        label: {
          label: `sample_one_table_${tableID}`,
          description: "sample_one_table",
        },
        type: "SAMPLE_TYPE_ONE",
        insertText: "LD.sample_one_table1",
        kind: CompletionItemKind.Method,
        sortText: "a",
      },
    ]);
  }
  const PluginID = props.id;
  const layoutConfig = {
    [SlotLocation.main]: {
      modules: ["@opensumi/ide-editor"],
    },
  };

  const [editor, setEditor] = useState(true);

  const sqlConfig: SqlServiceConfig = {
    lowerCaseComplete: true,
    completionTypes: {
      KEYWORD: {
        text: "关键词",
        kind: CompletionItemKind.Keyword,
      },
      CONSTS: {
        text: "常量",
        kind: CompletionItemKind.Snippet,
      },
      FUNCTION: {
        text: "函数",
        kind: CompletionItemKind.Function,
      },
      TABLE: {
        text: "表名",
        kind: CompletionItemKind.Method,
      },
      TABLEALIAS: {
        text: "表别名",
        kind: CompletionItemKind.Method,
      },
      SNIPPET: {
        text: "代码块",
        kind: CompletionItemKind.Snippet,
      },
      FIELD: {
        text: "表字段",
        kind: CompletionItemKind.Field,
      },
      FIELDALIAS: {
        text: "表字段别名",
        kind: CompletionItemKind.Field,
      },
    },
    sorter: {
      TABLE: "c",
      TABLEALIAS: "c",
      FIELD: "d",
      FIELDALIAS: "d",
      KEYWORD: "e",
      CONSTS: "e",
      FUNCTION: "f",
      DEFAULT: "g",
    },
  };

  const onSuggestTables = (prefix, options) => {
    return [
      {
        label: {
          label: `sample_one_table_1`,
          description: "sample_one_table1",
        },
        type: "SAMPLE_TYPE_ONE",
        insertText: "LD.sample_one_table1",
        kind: CompletionItemKind.Method,
        sortText: "a",
      },
      {
        label: {
          label: `sample_one_table_2`,
          description: "sample_one_table2",
        },
        type: "SAMPLE_TYPE_TWO",
        insertText: "LD.sample_one_table2",
        kind: CompletionItemKind.Method,
        sortText: "a",
      },
    ];
  };

  const onSuggestFields = async (
    prefix,
    options
  ): Promise<monaco.languages.CompletionItem[]> => {
    return new Promise((res, rej) => {
      res([
        {
          label: {
            label: "age",
            description: "age description",
          },
          // type: 'SAMPLE_TYPE_ONE',
          insertText: "age",
          kind: CompletionItemKind.Field,
          sortText: "b",
        },
        {
          label: {
            label: "banana",
            description: "banana description",
          },
          // type: 'SAMPLE_TYPE_ONE',
          insertText: "banana",
          kind: CompletionItemKind.Field,
          sortText: "b",
        },
        {
          label: "sample_one_table1",
          // type: 'SAMPLE_TYPE_ONE',
          insertText: "id_test",
          kind: CompletionItemKind.Field,
          sortText: "b",
        },
      ] as monaco.languages.CompletionItem[]);
    });
  };

  const ServicePlugin = new SQLServicePlugin(
    sqlConfig,
    onSuggestTables,
    onSuggestFields,
    (path, data) => {
      console.log(path, data);
    }
  );

  return (
    <div style={{ height: "200px", display: "flex" }}>
      <Button style={{ zIndex: "100" }} onClick={() => setEditor(false)}>
        销毁editor
      </Button>
      <Button onClick={() => changeTables()}>change suggest Tables</Button>

      {editor && (
        <div style={{ border: "1px solid #ccc", zIndex: "10", width: "100%" }}>
          <KeepAlive visible={props.visible}>
            <AppRenderer
              key={PluginID}
              appConfig={{
                plugins: [ServicePlugin, SQLPlugin],
                // extensionMetadata: [OBLanguage],
                workspaceDir: `sql-service`,
                layoutConfig,
                modules: [
                  SqlServiceModule.Config({
                    lowerCaseComplete: true,
                    onChange: (data) => {
                      console.log(data);
                    }
                  }),                ],
                defaultPreferences: {
                  "general.theme": "opensumi-light",
                  "application.confirmExit": "never",
                  "editor.autoSave": "afterDelay",
                  "editor.guides.bracketPairs": false,
                  "editor.minimap": false,
                  "editor.autoSaveDelay": 1000,
                  "editor.fixedOverflowWidgets": true, // widget editor 默认改为 fixed
                  "files.encoding": "utf8", // 默认编码
                  "editor.fontSize": 12,
                },
              }}
              runtimeConfig={{
                // hideEditorTab: true,
                // defaultOpenFile: 'test.sql',
                hideBreadcrumb: true,
                hideLeftTabBar: true,
                registerKeybindings: [
                  {
                    command: "editor.action.formatDocument",
                    keybinding: "f8",
                  },
                ],
                workspace: {
                  filesystem: {
                    fs: "FileIndexSystem",
                    options: {
                      // 初始全量文件索引
                      requestFileIndex() {
                        return Promise.resolve({
                          test_uri1: { "test.ob": "select * from 111" },
                          test_uri2: { "test2.ob": "select * from 222" },
                        });
                      },
                    },
                  },
                },
              }}
            />
          </KeepAlive>
        </div>
      )}
    </div>
  );
};
