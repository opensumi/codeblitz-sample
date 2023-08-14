// codeup 代码服务接入示例

import React from 'react';
import ReactDOM from 'react-dom';
import { IAppInstance, AppRenderer, getDefaultLayoutConfig, SlotLocation, AppRenderer2 } from '@alipay/alex';
import '@alipay/alex/languages';
import { CodeServiceModule } from '@alipay/alex-code-service';
import { CodeAPIModule, CodePlatform } from '@alipay/alex-code-api';
import { isFilesystemReady } from '@alipay/alex-core';
import { StartupModule } from './startup.module';
import css from '@alipay/alex/extensions/alex-ext-public.css-language-features-worker';
import html from '@alipay/alex/extensions/alex-ext-public.html-language-features-worker';
import json from '@alipay/alex/extensions/alex-ext-public.json-language-features-worker';
import markdown from '@alipay/alex/extensions/alex-ext-public.markdown-language-features-worker';
import typescript from '@alipay/alex/extensions/alex-ext-public.typescript-language-features-worker';

// 内置插件
import gitlens from '@alipay/alex/extensions/alex-ext-public.gitlens';
import graph from '@alipay/alex/extensions/alex-ext-public.git-graph';
import codeservice from '@alipay/alex/extensions/alex.code-service';
import imagePreview from '@alipay/alex/extensions/alex-ext-public.image-preview';
import webSCM from '@alipay/alex/extensions/alex-ext-public.web-scm';
import anycode from '@alipay/alex/extensions/alex-ext-public.anycode';
import anycodeCSharp from '@alipay/alex/extensions/alex-ext-public.anycode-c-sharp';
import anycodeCpp from '@alipay/alex/extensions/alex-ext-public.anycode-cpp';
import anycodeGo from '@alipay/alex/extensions/alex-ext-public.anycode-go';
import anycodeJava from '@alipay/alex/extensions/alex-ext-public.anycode-java';
import anycodePhp from '@alipay/alex/extensions/alex-ext-public.anycode-php';
import anycodePython from '@alipay/alex/extensions/alex-ext-public.anycode-python';
import anycodeRust from '@alipay/alex/extensions/alex-ext-public.anycode-rust';
import anycodeTypescript from '@alipay/alex/extensions/alex-ext-public.anycode-typescript';
import referencesView from '@alipay/alex/extensions/alex-ext-public.references-view';
import emmet from '@alipay/alex/extensions/alex-ext-public.emmet';
import codeswing from '@alipay/alex/extensions/alex-ext-public.codeswing';
import codeRunner from '@alipay/alex/extensions/alex-ext-public.code-runner-for-web';

// import * as SCMPlugin from './web-scm.plugin';
import { WorkbenchEditorService } from '@opensumi/ide-editor';


/*  TODO
 *  1. 搜索内容功能
 *  2. scm插件 依赖提交接口以及所有文件接口
 *  3. gitlens 插件依赖 blame接口
 */

// 访问地址 


isFilesystemReady().then(() => {
  console.log('filesystem ready');
});

const platformConfig = {
  codeup: {
    owner: 'test',
    name: 'qingyou_test',
    projectId: '3694747',
  }
};

const layoutConfig = getDefaultLayoutConfig();
layoutConfig[SlotLocation.left].modules.push(
  '@opensumi/ide-extension-manager',
  '@opensumi/ide-scm'
);

let pathParts = location.pathname.split('/').filter(Boolean);

const platform: any = pathParts[0] in platformConfig ? pathParts[0] : 'codeup';

const config = platformConfig[platform];
if (pathParts[1]) {
  config.owner = pathParts[1];
}
if (pathParts[2]) {
  config.name = pathParts[2];
}
config.refPath = pathParts.slice(3).join('/');

const extensionMetadata = [
  css,
  html,
  json,
  markdown,
  typescript,
  codeservice,
  gitlens,
  graph,
  imagePreview,
  // webSCM,
  referencesView,
  codeswing,
  emmet,
  anycodeCSharp,
  anycodeCpp,
  anycodeGo,
  anycodeJava,
  anycodePhp,
  anycodePython,
  anycodeRust,
  anycodeTypescript,
  anycode,
  codeRunner,
]


const App = () => (
  <AppRenderer
    onLoad={(app) => {
      window.app = app;
    }}
    appConfig={{
      // plugins: [Plugin, SCMPlugin],
      modules: [
        CodeServiceModule.Config({
          platform,
          owner: config.owner,
          name: config.name,
          refPath: config.refPath,
          commit: config.commit,
          hash: location.hash,
          // codeup
          projectId: config.projectId,
          antcode: {
            endpoint: '/code-service',
            isInMemory: true,
            // for test environment
            // endpoint: '/code-test',
            // origin: 'http://code.test.alipay.net:9009/code-test'
          },
          gitlink: {
            endpoint: '/code-service',
            // origin: 'https://testforgeplus.trustie.net'
          },
          codeup: {
            endpoint: '/code-service',
          }
        }),
        CodeAPIModule,
        StartupModule,
      ],
      extensionMetadata,
      workspaceDir: `${platform}/${config.owner}/${config.name}`,
      layoutConfig,
      defaultPreferences: {
        'general.theme': 'opensumi-dark',
      },
    }}
    runtimeConfig={{
      biz: 'alex_demo',
      scmFileTree: true,
      scenario: 'ALEX_DEMO',
      // unregisterActivityBarExtra: true,
      // hideLeftTabBar: true
      // workspace: {
      //   filesystem: {
      //     fs: 'IndexedDB',
      //     options: {
      //       storeName: 'ALEX_HOME'
      //       // cacheSize?: number;
      //     }
      //   }
      // }
    }}
  />
);

let key = 0;
const render = () => ReactDOM.render(<App key={key++} />, document.getElementById('main'));
render();
// for dispose test
window.reset = (destroy = false) =>
  destroy ? ReactDOM.render(<div>destroyed</div>, document.getElementById('main')) : render();

declare global {
  interface Window {
    app: IAppInstance;
    reset(destroyed?: boolean): void;
    testPlugin(): void;
  }
}
