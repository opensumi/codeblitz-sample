import React from 'react';
import ReactDOM from 'react-dom';

import { AppRenderer, BrowserFSFileType as FileType } from '@alipay/alex/bundle'
import '@alipay/alex/bundle/alex.css';
import '@alipay/alex/languages'
import { RegisterMenuModule } from './modules/registerMenu'
const dirMap: Record<string, [string, FileType][]> = {
  '/': [
    ['doc', FileType.DIRECTORY],
    ['hello.html', FileType.FILE],
    ['hello.js', FileType.FILE],
    ['hello.py', FileType.FILE],
    ['Hello.java', FileType.FILE],
    ['hello.go', FileType.FILE],
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
`.trimStart()
}

const App = () => {
  return (
    <AppRenderer
      appConfig={{
        // 工作空间目录
        workspaceDir: 'alex-startup',
        modules: [RegisterMenuModule]
      }}
      runtimeConfig={{
        // 业务标识
        biz: 'alex-startup',
        workspace: {
          // 文件系统
          filesystem: {
            fs: 'DynamicRequest',
            options: {
              readDirectory(p: string) {
                return dirMap[p];
              },
              readFile(p) {
                return new TextEncoder().encode(fileMap[p])
              },
            },
          }
        },
      }}
    />
  )
}

ReactDOM.render(<App />, document.getElementById('main'))
