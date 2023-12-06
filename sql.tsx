import React, { useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { IAppInstance, AppRenderer } from "@codeblitzjs/ide-core";
import "@codeblitzjs/ide-core/languages/sql";
import { CompletionItemKind } from "@opensumi/ide-extension/lib/common/vscode/ext-types";

import { Button } from "@opensumi/ide-components";
import { IEditor } from "@opensumi/ide-editor";
import { Popover, Radio, Menu } from "antd";
import "antd/dist/antd.css";
import * as SQLPlugin from "./plugins/sql-plugin";
import { SQLRender } from "./components/SQLRender";

const App = () => {
  const [fontValue, setFontValue] = useState(16);
  const [encoding, setEncoding] = useState("utf8");
  const [editorNumber, setEditorNumber] = useState(1);

  let tableID = 1;

  const suggestTables = useRef([
    {
      label: `sample_one_table_${tableID}`,
      type: "SAMPLE_TYPE_ONE",
      insertText: "LD.sample_one_table1",
      kind: CompletionItemKind.Method,
      sortText: "a",
    },
  ]);

  function changeTables() {
    tableID++;
    suggestTables.current = suggestTables.current.concat([
      {
        label: `sample_one_table_${tableID}`,
        type: "SAMPLE_TYPE_ONE",
        insertText: "LD.sample_one_table1",
        kind: CompletionItemKind.Method,
        sortText: "a",
      },
    ]);
  }

  const onChangeFont = (e) => {
    setFontValue(e.target.value);
    updatePrefeence("editor.fontSize", e.target.value);
  };
  const onChangeEnoding = (e) => {
    setEncoding(e.target.value);
    updatePrefeence("files.encoding", e.target.value);
  };

  function editorNumberUpdate() {
    console.log("editorNumberUpdate", editorNumber);
    setEditorNumber(editorNumber + 1);
  }

  function format() {
    SQLPlugin.api.commands?.executeCommand("editor.action.formatDocument");
  }

  function updatePrefeence(perferenceName, value) {
    // 设置首选项
    SQLPlugin.api.commands?.executeCommand(
      "alex.setDefaultPreference",
      perferenceName,
      value
    );
  }

  async function addLine() {
    const editor = (await SQLPlugin.api.commands?.executeCommand(
      "alex.sql.editor"
    )) as IEditor;
    editor?.monacoEditor.trigger("editor", "type", { text: "\n" });
  }

  function openFile() {
    /** COMMAND alex.sql.open
     *  @param {string} uri - 文件uri
     *  @param {string} content - 文件内容 无内容时创建并注入默认内容
     */
    SQLPlugin.api.commands?.executeCommand(
      "alex.sql.open",
      "test1.sql",
      "默认内容"
    );
  }

  async function editor() {
    const editor = (await SQLPlugin.api.commands?.executeCommand(
      "alex.sql.editor"
    )) as IEditor;
    console.log(editor?.monacoEditor.getValue());
  }

  const content = () => (
    <div>
      <p>编码</p>
      <Radio.Group onChange={onChangeEnoding} value={encoding}>
        <Radio value={"utf8"}>utf8</Radio>
        <Radio value={"gbk"}>gbk</Radio>
        <Radio value={"utf16le"}>utf16le</Radio>
      </Radio.Group>
      <p>字体大小</p>
      <Radio.Group onChange={onChangeFont} value={fontValue}>
        <Radio value={10}>10</Radio>
        <Radio value={16}>16</Radio>
      </Radio.Group>
    </div>
  );
  const items = [
    {
      label: "Navigation One",
      key: "1",
    },
    {
      label: "Navigation Two",
      key: "2",
    },
  ];
  const [current, setCurrent] = useState("1");

  const menuCick = (e) => {
    setCurrent(e.key);
    // 每次切换tab 打开对应的文件
    if (e.key === "1") {
      SQLPlugin.api.commands?.executeCommand(
        "alex.sql.open",
        "test_uri1/test.sql"
      );
    } else {
      SQLPlugin.api.commands?.executeCommand(
        "alex.sql.open",
        "test_uri2/test.sql"
      );
    }
  };

  return (
    <div style={{ height: "100%", overflow: "scroll" }}>
      <div style={{ height: "300px" }}>
        <div style={{ margin: "20px" }}>
          <Button onClick={() => format()}>格式化</Button>
          <Button onClick={() => addLine()}>添加行</Button>
          <Button onClick={() => openFile()}>打开文件</Button>
          <Button onClick={() => editor()}>获取当前内容</Button>
          <Popover content={content} placement="top">
            <Button>设置</Button>
          </Popover>
          <Button onClick={() => window.reset()}>reset </Button>
          <Menu
            onClick={menuCick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
          />
          <div style={{ display: `${current === "1" ? "block" : "none"}` }}>
            <SQLRender id={current} visible={current === "1"} />
          </div>
          <div style={{ display: `${current === "2" ? "block" : "none"}` }}>
            <SQLRender id={current} visible={current === "2"} />
          </div>
        </div>
      </div>
    </div>
  );
};

let key = 0;
const render = () =>
  ReactDOM.render(<App key={key++} />, document.getElementById("main"));
render();
// for dispose test
window.reset = (destroy = false) =>
  destroy
    ? ReactDOM.render(<div>destroyed</div>, document.getElementById("main"))
    : render();

declare global {
  interface Window {
    app: IAppInstance;
    reset(destroyed?: boolean): void;
  }
}
