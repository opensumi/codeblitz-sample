import React from 'react';
import ReactDOM from 'react-dom';

import { AppRenderer, BrowserFSFileType as FileType } from '@alipay/alex/bundle'
import '@alipay/alex/bundle/alex.css';
import '@alipay/alex/languages'
import { RegisterMenuModule } from './modules/registerMenu'
import WorkerExample from '@alipay/alex/extensions/alex-demo.worker-example'
// YAML 插件
import yaml from '@alipay/alex/extensions/vscode-extensions.vscode-yaml';

const dirMap: Record<string, [string, FileType][]> = {
  '/': [
    ['doc', FileType.DIRECTORY],
    ['hello.html', FileType.FILE],
    ['hello.js', FileType.FILE],
    ['hello.py', FileType.FILE],
    ['Hello.java', FileType.FILE],
    ['hello.go', FileType.FILE],
    ['appveyor.yml', FileType.FILE],
  ],
  '/doc': [
    ['README.md', FileType.FILE],
  ],
};

const fileMap = {
  '/doc/README.md': '# alex-startup\n> alex demo',
  '/hello.html': `
<!DOCTYPE html>
<html>
<body>
  <p>Hello, World!</p>
</body>
</html>
`.trimStart(),
  '/hello.js': 'console.log("Hello, World!");',
  '/hello.py': 'print("Hello, World!")',
  '/Hello.java': `
public class Hello {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
`.trimStart(),
  '/hello.go': `
package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}
`.trimStart(),
'/appveyor.yml':`# version format
version: 1.0.{build}

# you can use {branch} name in version format too
# version: 1.0.{build}-{branch}

# branches to build
branches:
  # whitelist
  only:
    - master
    - production

  # blacklist
  except:
    - gh-pages

# Do not build on tags (GitHub, Bitbucket, GitLab, Gitea)
skip_tags: true

# Start builds on tags only (GitHub, BitBucket, GitLab, Gitea)
skip_non_tags: true`.trimStart()
}

const App = () => {
  return (
    <AppRenderer
      appConfig={{
        // 工作空间目录
        workspaceDir: 'alex-startup',
        // 模块在bundle包中无法使用
        // modules: [RegisterMenuModule]
        extensionMetadata:[WorkerExample, yaml],
        defaultPreferences: {
          // yaml 语法配置
          "https://json.schemastore.org/appveyor.json": ["appveyor.yaml", "appveyor.yml"],
        }
      }}
      runtimeConfig={{
        // 业务标识
        biz: 'alex-startup',
        workspace: {
          // 文件系统
          // filesystem: {
          //   fs: 'DynamicRequest',
          //   options: {
          //     readDirectory(p: string) {
          //       return dirMap[p];
          //     },
          //     readFile(p) {
          //       return new TextEncoder().encode(fileMap[p])
          //     },
          //   },
          // }

          // 本地indexedDB文件系统
          filesystem: {
            fs: 'OverlayFS',
            options: {
              writable: {fs: 'IndexedDB'},
              readable: {
                fs: 'DynamicRequest',
                options: {
                  readDirectory(p: string) {
                    return dirMap[p];
                  },
                  async readFile(p) {
                    return new TextEncoder().encode(fileMap[p])
                  },
                },
              },

            }
          }
        },
      }}
    />
  )
}

ReactDOM.render(<App />, document.getElementById('main'))
