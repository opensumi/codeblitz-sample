// 接收zip文件 保存后在输出zip
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { AppRenderer } from '@codeblitzjs/ide-core';
import '@codeblitzjs/ide-core/bundle/codeblitz.css';
import '@codeblitzjs/ide-core/languages';
import typescript from '@codeblitzjs/ide-core/extensions/codeblitz.typescript-language-features-worker';
import { DOWNLOAD_ZIP, getDefaultLayoutConfig, RegisterZipMenuModule } from './modules/registerZipMenu';
import ZipPlugin from './common/zipPlugin';

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

export const FullScreenToken = Symbol('FullScreenToken');


const App = () => {

  const [isFullScreen, setFullscreen] = useState<boolean>(false);

  const zipPlugin = useMemo(() => {
    return new ZipPlugin(
      () => setFullscreen(true),
      () => setFullscreen(false),
      isFullScreen
    );
  }, []);

  const downloadZip = () => {
    zipPlugin.commands?.executeCommand(DOWNLOAD_ZIP)
  }
  return (
    <div style={{ height: '100%', padding: '100px', backgroundColor: '#ccc'}}>
      <div>
        <button onClick={() => downloadZip()}>点击下载zip</button>
      </div>
      <div style={{
        position: isFullScreen ? 'fixed' : 'static',
        height: isFullScreen ? '100vh' : '100%',
        top: isFullScreen ? 0 : 0,
        left: isFullScreen ? 0 : 0,
        width: '100%'
      }}>
        <AppRenderer
          key='zip'
          onLoad={app=> {
            window.app = app;
            // app.injector.addProviders({
            //   token: FullScreenToken,
            //   useFactory: (inject) => {
            //     setFullscreen(!isFullScreen); 
            //   },
            // })
          }}
          appConfig={{
            workspaceDir: 'zip_file_system',
            defaultPreferences: {
              'general.theme': 'opensumi-design-light-theme',
              'editor.guides.bracketPairs': false,
            },
            layoutConfig: getDefaultLayoutConfig(),
            extensionMetadata: [
              typescript
            ],
            modules: [RegisterZipMenuModule],
            plugins: [zipPlugin]
          }}
          runtimeConfig={{
            workspace: {
              filesystem: {
                fs: 'OverlayFS',
                options: {
                  writable: { 
                    fs: 'IndexedDB',
                    options: {
                      storeName: 'zipFS',
                    },
                  },
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
  ReactDOM.createRoot(document.getElementById('main')!).render(<App />);
});
