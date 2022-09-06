import React from 'react';
import ReactDOM from 'react-dom';

import { AppRenderer, BoxPanel, BrowserFSFileType as FileType, SlotLocation, SlotRenderer } from '@alipay/alex/bundle'
import '@alipay/alex/bundle/alex.css';
// 按需引入
import '@alipay/alex/languages/sql';

/* //使用本地插件模拟
import { useLoadLocalExtensionMetadata } from './utils/localExtension' 
 */
import wrokerSql from '@alipay/alex/extensions/alex-demo.worker-sql'



// 布局配置，可根据需要增删模块
export const layoutConfig = {
  [SlotLocation.main]: {
    modules: ['@ali/ide-editor'],
  },
};

const LayoutComponent = () => (
  <BoxPanel direction="top-to-bottom">
    <SlotRenderer flex={2} flexGrow={1} minResize={200} slot="main" />
  </BoxPanel>
);

// 禁用的快捷键
const unregisterKeybindings = [
  'ctrlcmd+,',
  'ctrlcmd+shift+p',
  'ctrlcmd+p',
  'F1',
  'alt+n',
  'alt+shift+t',
  'alt+shift+w',
  'ctrlcmd+\\',
];

const Editor = () => {
/* // 使用本地插件模拟  
  const extensionMetadata = useLoadLocalExtensionMetadata();
  if(!extensionMetadata) return null; 
*/

  return (
    <AppRenderer
      appConfig={{
        // 工作空间目录
        workspaceDir: 'alex-sql',
        layoutConfig,
        layoutComponent: LayoutComponent,
        defaultPreferences: {
          'editor.scrollBeyondLastLine': false,
          'editor.autoSave': 'afterDelay',
          'editor.autoSaveDelay': 1000, // one second
          'editor.wordBasedSuggestions': true,
          'editor.fixedOverflowWidgets': true,
          'general.theme': 'opensumi-light',
          'general.language': 'zh_CN',
        },
        /* //使用本地插件模拟
          extensionMetadata, 
        */
       // 插件配置
        extensionMetadata: [wrokerSql]
      }}
      runtimeConfig={{
        biz: 'alex-sql',
        scenario: null,
        startupEditor: 'none',
        hideEditorTab: true,
        hideBreadcrumb: true,
        unregisterKeybindings,
      }}
      
    />
  )
}

ReactDOM.render(<Editor />, document.getElementById('main'))
