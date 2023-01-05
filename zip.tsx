// 接收zip文件 保存后在输出zip
import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { AppRenderer, BrowserFSFileType as FileType, IAppRendererProps, Uri , requireModule} from '@alipay/alex/bundle';
import '@alipay/alex/bundle/alex.css';
import '@alipay/alex/languages';
import typescript from '@alipay/alex/extensions/alex-ext-public.typescript-language-features-worker';
import { getDefaultLayoutConfig, RegisterZipMenuModule } from './modules/registerZipMenu';
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

  return (
    <div style={{ height: '100%', padding: '100px', backgroundColor: '#ccc'}}>
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
              'general.theme': 'opensumi-light',
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
            biz: 'zipFS',
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
  ReactDOM.render(<App />, document.getElementById('main'));
});
