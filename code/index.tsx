import React from 'react';
import ReactDOM from 'react-dom/client';
import { IAppInstance, AppRenderer, getDefaultLayoutConfig, SlotLocation } from '@codeblitzjs/ide-core';
import '@codeblitzjs/ide-core/languages';
import { CodeServiceModule } from '@codeblitzjs/ide-code-service';
import { CodeAPIModule, CodePlatform } from '@codeblitzjs/ide-code-api';
import { isFilesystemReady } from '@codeblitzjs/ide-sumi-core';
import { StartupModule } from './startup.module';

// 内置插件
import css from '@codeblitzjs/ide-core/extensions/codeblitz.css-language-features-worker';
import html from '@codeblitzjs/ide-core/extensions/codeblitz.html-language-features-worker';
import json from '@codeblitzjs/ide-core/extensions/codeblitz.json-language-features-worker';
import markdown from '@codeblitzjs/ide-core/extensions/codeblitz.markdown-language-features-worker';
import typescript from '@codeblitzjs/ide-core/extensions/codeblitz.typescript-language-features-worker';
import gitlens from '@codeblitzjs/ide-core/extensions/codeblitz.gitlens';
import graph from '@codeblitzjs/ide-core/extensions/codeblitz.git-graph';
import imagePreview from '@codeblitzjs/ide-core/extensions/codeblitz.image-preview';
import webSCM from '@codeblitzjs/ide-core/extensions/codeblitz.web-scm';
import anycode from '@codeblitzjs/ide-core/extensions/codeblitz.anycode';
import anycodeCSharp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-c-sharp';
import anycodeCpp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-cpp';
import anycodeGo from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-go';
import anycodeJava from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-java';
import anycodePhp from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-php';
import anycodePython from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-python';
import anycodeRust from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-rust';
import anycodeTypescript from '@codeblitzjs/ide-core/extensions/codeblitz.anycode-typescript';
import referencesView from '@codeblitzjs/ide-core/extensions/codeblitz.references-view';
import emmet from '@codeblitzjs/ide-core/extensions/codeblitz.emmet';
import codeswing from '@codeblitzjs/ide-core/extensions/codeblitz.codeswing';
import codeRunner from '@codeblitzjs/ide-core/extensions/codeblitz.code-runner-for-web';
import mergeConflict from '@codeblitzjs/ide-core/extensions/codeblitz.merge-conflict';

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
  github: {
    owner: 'opensumi',
    name: 'codeblitz'
  }
};

const layoutConfig = getDefaultLayoutConfig();
layoutConfig[SlotLocation.left].modules.push(
  '@opensumi/ide-extension-manager',
  '@opensumi/ide-scm'
);

let pathParts = location.pathname.split('/').filter(Boolean);

const platform: any = pathParts[0] in platformConfig ? pathParts[0] : 'github';

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
  gitlens,
  graph,
  imagePreview,
  webSCM,
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
  mergeConflict
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
          gitlink: {
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
        'general.theme': 'opensumi-design-dark-theme',
      },
    }}
    runtimeConfig={{
      scmFileTree: true,
      scenario: 'CODEBLITZ_DEMO'
    }}
  />
);

let key = 0;
const render = () => ReactDOM.createRoot(document.getElementById('main')!).render(<App key={key++} />);
render();
// for dispose test
window.reset = (destroy = false) =>
  destroy ? ReactDOM.createRoot(document.getElementById('main')!).render(<div>destroyed</div>) : render();

declare global {
  interface Window {
    app: IAppInstance;
    reset(destroyed?: boolean): void;
    testPlugin(): void;
  }
}
