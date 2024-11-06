import React from 'react';
import ReactDOM from 'react-dom/client';

import { AppRenderer, requireModule, WORKSPACE_ROOT } from '@codeblitzjs/ide-core';
import '@codeblitzjs/ide-core/bundle/codeblitz.css';
import '@codeblitzjs/ide-core/languages';

let zipData: Buffer;

const zipDataPromise = (async () => {
  const res = await fetch(
    'http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/green-trail-test/dc85f34d-2467-436b-a0fe-092133ead0d6/demo.zip'
  );
  const buf = await res.arrayBuffer();
  zipData = Buffer.from(new Uint8Array(buf));
})();

const fse = requireModule('fs-extra')
const path = requireModule('path')

const workspaceDir = 'log'
const workspaceFolder = path.join(WORKSPACE_ROOT, workspaceDir)

const walkWorkspace = async (dir: string, callback: (filepath: string) => Promise<boolean>) => {
  const filenames: string[] = await fse.readdir(dir)
  let finish = false
  for (const filename of filenames) {
    const filepath = path.join(dir, filename)
    const stat = await fse.stat(filepath)
    if (stat.isDirectory()) {
      await walkWorkspace(filepath, callback)
    } else {
      // 排除一些非文本文件
      if (!/\.(zip|jpg|png)$/.test(filepath)) {
        finish = await callback(filepath)
        if (finish) break
      }
    }
  }
}

const App = () => {
  return (
    <div style={{ height: '100%' }}>
      <AppRenderer
        appConfig={{
          workspaceDir,
        }}
        runtimeConfig={{
          workspace: {
            filesystem: {
              fs: 'ZipFS',
              options: {
                zipData,
              }
            }
          },
          textSearch: {
            config: {
              replace: false, // 禁用替换
              wordMatch: 'local', // 单词匹配用本地框架过滤
              include: 'local', // 文件包含用本地框架过滤
              exclude: 'local' // 文件排除用本地框架过滤
            },
            provideResults: (query, options, progress) => {
              let maxResults = 0
              return walkWorkspace(workspaceFolder, async (filepath) => {
                if (maxResults > options.maxResults) return true
                const content = await fse.readFile(filepath, 'utf8')
                if (!content) return false;
                const lines: string[] = content.split(/\r\n|\r|\n/g)
                lines.forEach((line, index) => {
                  if (!line) return
                  if (maxResults > options.maxResults) return
                  const matches: [number, number][] = []
                  if (query.isRegExp) {
                    const regexp = new RegExp(query.pattern, `g${query.isCaseSensitive ? '' : 'i'}`)
                    let execArray: RegExpExecArray | null = null
                    while(execArray = regexp.exec(line)) {
                      if (!execArray) return
                      matches.push([ execArray.index, execArray.index + execArray[0].length ])
                    }
                    if (matches.length) {
                      progress.report({
                        path: path.relative(workspaceFolder, filepath),
                        lineNumber: index + 1,
                        preview: {
                          text: line,
                          matches,
                        },
                      })
                      maxResults++
                    }
                  } else {
                    const text = query.isCaseSensitive ? line : line.toLowerCase();
                    const search = query.isCaseSensitive ? query.pattern : query.pattern.toLowerCase()
                    let lastMatchIndex = -search.length;
                    while (
                      (lastMatchIndex = text.indexOf(search, lastMatchIndex + search.length)) !== -1
                    ) {
                      matches.push([lastMatchIndex, lastMatchIndex + search.length]);
                    }
                    if (matches.length) {
                      progress.report({
                        path: path.relative(workspaceFolder, filepath),
                        lineNumber: index + 1,
                        preview: {
                          text: line,
                          matches,
                        },
                      });
                      maxResults++
                    }
                  }
                })
                return maxResults >= options.maxResults
              })
            }
          }
        }}
      />
    </div>
  );
};

zipDataPromise.then(() => {
  ReactDOM.createRoot(document.getElementById('main')!).render(<App />);
});
