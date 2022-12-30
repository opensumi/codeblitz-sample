import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';

import { AppRenderer, BrowserFSFileType as FileType, IAppRendererProps, Uri } from '@alipay/alex';
import '@alipay/alex/bundle/alex.css';
import '@alipay/alex/languages';

import Select from 'antd/lib/select';
import 'antd/lib/select/style/index.css';
import { IFileServiceClient, FileChangeType } from '@opensumi/ide-file-service/lib/common';

const dirMap: Record<string, [string, FileType][]> = {
  '/': [
    ['lib', FileType.DIRECTORY],
    ['Readme.md', FileType.FILE],
    ['LICENSE', FileType.FILE],
    ['package.json', FileType.FILE],
  ],
  '/lib': [
    ['application.js', FileType.FILE],
    ['context.js', FileType.FILE],
    ['request.js', FileType.FILE],
    ['response.js', FileType.FILE],
  ],
};

let zipData: Buffer;

const zipDataPromise = (async () => {
  const res = await fetch(
    'http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/dc85f34d-2467-436b-a0fe-092133ead0d6/demo.zip'
  );
  const buf = await res.arrayBuffer();
  zipData = Buffer.from(new Uint8Array(buf));
})();

const App = () => {
  const [fsType, setFsType] = useState<string>('');

  const filesystem = useMemo<
    NonNullable<IAppRendererProps['runtimeConfig']['workspace']>['filesystem'] | undefined
  >(() => {
    switch (fsType) {
      case 'IndexedDB':
        return {
          fs: 'IndexedDB',
          options: {
            storeName: 'my_db',
          },
        };
      case 'InMemory':
        return {
          fs: 'InMemory',
        };
      case 'FileIndexSystem':
        return {
          fs: 'FileIndexSystem',
          options: {
            // 初始全量文件索引
            requestFileIndex() {
              return Promise.resolve({
                'main.html': '<div id="root"></div>',
                'main.css': 'body {}',
                'main.js': 'console.log("main")',
                'package.json': '{\n  "name": "Riddle"\n}',
              });
            },
          },
        };
      case 'DynamicRequest':
        return {
          fs: 'DynamicRequest',
          options: {
            readDirectory(p: string) {
              return dirMap[p];
            },
            async readFile(p) {
              const res = await fetch(
                `http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/a87fb80d-3028-4b19-93a9-2da6f871f369/koa${p}`
              );
              return Buffer.from(await res.arrayBuffer());
            },
          },
        };
      case 'ZipFS':
        return {
          fs: 'ZipFS',
          options: {
            zipData,
          },
        };
      case 'FolderAdapter':
        return {
          fs: 'FolderAdapter',
          options: {
            folder: '/demo',
            wrapped: {
              fs: 'ZipFS',
              options: {
                zipData,
              },
            },
          },
        };
      case 'OverlayFS':
        return {
          fs: 'OverlayFS',
          options: {
            writable: { fs: 'InMemory' },
            readable: {
              fs: 'DynamicRequest',
              options: {
                readDirectory(p: string) {
                  return dirMap[p];
                },
                async readFile(p) {
                  const res = await fetch(
                    `http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/a87fb80d-3028-4b19-93a9-2da6f871f369/koa${p}`
                  );
                  return new Uint8Array(await res.arrayBuffer());
                },
              },
            },
          },
        };
    }
  }, [fsType]);

  const workspace = filesystem ? { filesystem } : undefined;

  return (
    <div style={{ height: '100%' }}>
      <div style={{ height: 48, display: 'flex', alignItems: 'center' }}>
        <Select<string> onChange={(e) => setFsType(e)} style={{ width: 200 }}>
          <Select.Option value="IndexedDB">IndexedDB</Select.Option>
          <Select.Option value="InMemory">InMemory</Select.Option>
          <Select.Option value="FileIndexSystem">FileIndexSystem</Select.Option>
          <Select.Option value="DynamicRequest">DynamicRequest</Select.Option>
          <Select.Option value="ZipFS">ZipFS</Select.Option>
          <Select.Option value="FolderAdapter">FolderAdapter</Select.Option>
          <Select.Option value="OverlayFS">OverlayFS</Select.Option>
        </Select>
      </div>
      <div style={{ height: 'calc(100% - 48px)' }}>
        <AppRenderer
          key={fsType}
          onLoad={app=> {
            window.app = app;
            const fileService = app.injector.get(IFileServiceClient)
            fileService.onFilesChanged(async e => {
              // 获取新建的文件
              const createFiles =  e.filter(f => {
                // FileChangeType
                // UPDATED = 0,
                // ADDED = 1,
                // DELETED = 2
                if(f.type ===1){
                  return f;
                }
              })
              const promiseAll: Promise<any>[] = [];
              createFiles.map( file => {
                const uri = file.uri;
                promiseAll.push(fileService.readFile(uri));
              })
              
              await Promise.all(promiseAll).then(res => {
                res.map(r => {
                  console.log(r.content.toString())
                })
              })
            });
          }}
          appConfig={{
            workspaceDir: 'filesystem',
            defaultPreferences: {
              'general.theme': 'opensumi-light',
            },
          }}
          runtimeConfig={{
            biz: 'filesystem',
            workspace,
          }}
        />
      </div>
    </div>
  );
};

zipDataPromise.then(() => {
  ReactDOM.render(<App />, document.getElementById('main'));
});
