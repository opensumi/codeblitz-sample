// 接收zip文件 保存后在输出zip
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { AppRenderer, BrowserFSFileType as FileType, IAppRendererProps, Uri , requireModule} from '@alipay/alex/bundle';
import '@alipay/alex/bundle/alex.css';
import '@alipay/alex/languages';
import typescript from '@alipay/alex/extensions/alex-ext-public.typescript-language-features-worker';
import { getDefaultLayoutConfig, RegisterZipMenuModule } from './modules/registerZipMenu';

let zipData: Buffer;

const zipDataPromise = (async () => {
  // 请求需开启本地静态服务器 
  // cd ./assets 
  // npx serve .
  const res = await fetch(
    // localhost:3000
    'http://btt-dw24vyoob7cntf7tfewspw7ooi.hon.alibaba-inc.com/compile.zip'
  );
  // const res = await fetch(
  //   'http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/dc85f34d-2467-436b-a0fe-092133ead0d6/demo.zip'
  // );
  const buf = await res.arrayBuffer();
  zipData = Buffer.from(new Uint8Array(buf));
})();


const App = () => {
  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: '100%' }}>
        <AppRenderer
          key='zip'
          onLoad={app=> {
            window.app = app;
          }}
          appConfig={{
            workspaceDir: 'zip_file_system',
            defaultPreferences: {
              'general.theme': 'opensumi-light',
            },
            layoutConfig: getDefaultLayoutConfig(),
            extensionMetadata: [
              typescript
            ],
            modules: [RegisterZipMenuModule]
          }}
          runtimeConfig={{
            biz: 'zipFS',
            workspace: {
              filesystem: {
                fs: 'OverlayFS',
                options: {
                  writable: { fs: 'InMemory' },
                  readable: {
                    fs: 'ZipFS',
                    options: {
                      zipData,
                    },
                  },
                },
              }
            },
          }}
        />
      </div>
    </div>
  );
};

zipDataPromise.then(() => {
  ReactDOM.render(<App />, document.getElementById('main'));
});
