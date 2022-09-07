import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
// 如不需要扩展，从 alex.editor 引入
import { IAppInstance, EditorRenderer } from '@alipay/alex/bundle/alex.editor.all';
import '@alipay/alex/bundle/alex.editor.all.css';

import 'antd/dist/antd.css'
import Select from 'antd/lib/select';
import Cascader from 'antd/lib/cascader';
import Button from 'antd/lib/button';
import Spin from 'antd/lib/spin';

//#region 语法高亮，根据需要动态注册
import '@alipay/alex/languages/html'
import '@alipay/alex/languages/css'
import '@alipay/alex/languages/javascript'
import '@alipay/alex/languages/typescript'
import '@alipay/alex/languages/json'
import '@alipay/alex/languages/markdown'
import '@alipay/alex/languages/java'
//#endregion

import WorkerExample from '@alipay/alex/extensions/alex-demo.worker-example'
import EditorDiff from '@alipay/alex/extensions/alex.editor-diff-ext'

import * as EditorPlugin from './plugin';

const fileOptions = (function transform(obj) {
  return Object.keys(obj).map((key) => {
    return {
      value: key,
      label: key,
      children: Array.isArray(obj[key])
        ? obj[key].map((v) => ({ value: v, label: v }))
        : transform(obj[key]),
    };
  });
})({
  'chaxuan.wh/qiankun-mirror': {
    master: ['src/globalState.ts'],
  },
  'wealth_release/finstrategy': {
    f577528518c7c0279f8cdf3de59ae24a80a16607: [
      'app/biz/service-impl/src/main/java/com/alipay/finstrategy/biz/service/impl/portfolio/msg/TradeMessageListener.java',
    ],
  },
  'kaitian/ide-framework': {
    develop: [
      'packages/addons/src/browser/file-drop.service.ts',
      'packages/addons/src/common/index.ts',
      'OWNERS',
    ],
  },
  'ide-s/TypeScript-Node-Starter': {
    'feat/123123': ['gbk.ts'],
  },
});

const App = () => {
  const [key, setKey] = useState(0);
  const [project, setProject] = useState('');
  const [ref, setRef] = useState('');
  const [filepath, setFilePath] = useState('');
  const [encoding, setEncoding] = useState<'utf8' | 'gbk' | undefined>('utf8');
  const [lineNumber, setLineNumber] = useState<number | [number, number] | undefined>();

  const onFileChange = ([project, ref, filepath]) => {
    setProject(project);
    setRef(ref);
    setFilePath(filepath);
  };

  const readFile = async (filepath: string) => {
    const res = await fetch(
      `/code-service/api/v3/projects/${encodeURIComponent(project)}/repository/blobs/${encodeURIComponent(
        ref
      )}?filepath=${filepath}`
    );
    if (res.status >= 200 && res.status < 300) {
      return new Uint8Array(await res.arrayBuffer());
    }
    throw new Error(`${res.status} - ${res.statusText}`);
  };

  return (
    <div style={{ padding: 8 }}>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <Cascader
          style={{ width: '100%' }}
          size="small"
          options={fileOptions}
          onChange={onFileChange}
          placeholder="Please select"
        />
      </div>
      <div style={{ display: 'flex', marginBottom: 8 }}>
        <Button onClick={() => setKey((k) => k + 1)} size="small" style={{ marginRight: 8 }}>
          RESET
        </Button>
        <Select
          value={encoding}
          onChange={setEncoding}
          size="small"
          style={{ width: 120, marginRight: 8 }}
          placeholder="更改编码"
        >
          {['utf8', 'gbk'].map((encoding) => (
            <Select.Option key={encoding} value={encoding}>
              {encoding}
            </Select.Option>
          ))}
        </Select>
        <Select
          value={lineNumber}
          onChange={setLineNumber}
          size="small"
          style={{ width: 120, marginRight: 8 }}
          placeholder="更改选中行"
        >
          {[10, 30, 100].map((line) => (
            <Select.Option key={line} value={line}>
              {line}
            </Select.Option>
          ))}
        </Select>
        <Button
          onClick={() => {
            const commands = EditorPlugin.api.commands;
            if (commands) {
              commands.executeCommand('plugin.command.test', 1, 2);
            }
          }}
          size="small"
        >
          command test
        </Button>
        <Button
          onClick={() => {
            const commands = EditorPlugin.api.commands;
            if (commands) {
              commands.executeCommand('alex.editor.diff',{
                originalContent: 'aaa \n bbb',
                modifiedContent: 'bbb \n aaa',
                originalPath: 'test1.js',
                modifiedPath: 'test2.js',
                // title: '标题可不填写'
              })
            }
          }}
          size="small"
        >
          diff test
        </Button>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%', minHeight: 500 }}>
          {project ? (
            <EditorRenderer
              key={`${project}-${key}`}
              onLoad={(app) => {
                window.app = app;
              }}
              Landing={() => (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spin />
                </div>
              )}
              appConfig={{
                // plugin 配置
                plugins: [EditorPlugin],
                // extension
                extensionMetadata: [WorkerExample,EditorDiff],
                // workspaceDir 和标准工作空间概念一样，建议不同项目不同，相对路径即可
                workspaceDir: project,
                // 默认配置
                defaultPreferences: {
                  // 白色主题  opensumi-light opensumi-dark
                  'general.theme': 'opensumi-light',
                  // 最后一行禁止继续滚动
                  'editor.scrollBeyondLastLine': false,
                  // 只读模式，目前只读和读写无法切换，设置了后不可更改
                  // 'editor.readonlyFiles': ['/workspace/**'],
                  'editor.forceReadOnly': true,
                  'editor.fontSize': 12,
                  // 开启 lsif
                  'lsif.documentScheme': 'file',
                  'lsif.enable': true,
                  // 设置环境 test | prod，对于测试环境建议设置为 test 此时会请求测试环境的 lsif 服务，可看测试仓库的数据
                  'lsif.env': 'prod',
                  // 其它配置可以参考 Ant Codespaces 上的支持的配置
                  // 列举几个可能用得到的
                  // 如果遇到 widgets 如 hover 被遮盖的情况，将 postion 改为 fixed
                  'editor.fixedOverflowWidgets': true
                },
              }}
              runtimeConfig={{
                // 业务，必须，用于内部埋点，各业务按照自己的业务名定即可
                biz: 'code',
                // 场景，在 editor 下推荐传 null，此时不会持久化缓存工作空间数据
                scenario: null,
                // 启动时显示的编辑器，editor 下传 none 即可
                startupEditor: 'none',
                // 隐藏 editor tab
                hideEditorTab: false,
              }}
              editorConfig={{
                // 禁用编辑器搜索，只在想用浏览器搜索的情况下禁用，通常不建议
                // disableEditorSearch: true,
                // 展开高度，如果想 editor 不适用虚拟滚动，完全展开代码，则开启
                // stretchHeight: true,
              }}
              // 文档模型，以下数据变更时会更新打开的编辑器
              documentModel={{
                // 类型，code 下为 code，保持不变
                type: 'code',
                // 分支或 tag
                ref,
                // 仓库群组和用户
                owner: project.split('/')[0],
                // 仓库名
                name: project.split('/')[1],
                // 仓库文件路径
                filepath,
                // 读取文件接口
                readFile,
                // 文件编码，和标准工作空间支持编码类型一致，简单场景只传 utf8 或 gbk 即可
                encoding,
                // 文件路径变更
                onFilepathChange(newFilepath) {
                  setFilePath(newFilepath);
                },
                // 行号设置及变更
                lineNumber,
                onLineNumberChange(num) {
                  setLineNumber(num);
                },
              }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('main'));

// for test
window.destroy = () => {
  ReactDOM.render(<div>destroyed</div>, document.getElementById('main'));
};

declare global {
  interface Window {
    app: IAppInstance;
    destroy(): void;
  }
}
