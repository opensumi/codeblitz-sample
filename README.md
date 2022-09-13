# alex-demo


## Alex 文档地址 [对接文档](https://yuque.antfin-inc.com/cloud-ide/alex/ad0sp7)

## 快速开始

```bash
# IDE 示例
npm run start

# Code Review 示例
npx alex ext install cloud-ide-ext.antcode-scaning
npx alex ext install cloud-ide-ext.editor-plugin-blame

npm run acr #需绑定 local.alipay.net 到本机 访问 local.alipay.net:8001

# 查看 sql-editor 示例 
cd extensions/wroker-sql
kaitian watch  #需先下载kaitian  tnpm i kaitian -g

npx alex ext link ./extensions/worker-sql #模拟下载sql本地插件
npm run startSql

# 查看 filesystem 示例
npm run fs

# 查看 基础editor 示例，需设置环境变量token     PRIVATE_TOKEN http://code.alipay.com/profile/private_tokens
PRIVATE_TOKEN=<token> npm run editor
```

### 安装扩展
```bash
npm run ext
```

### alex 命令
```bash
#安装扩展
npx alex ext install <extension>  # npx alex ext i alex-demo.worker-example

#本地调试wroker插件
npx alex ext link <pwd>  #npx alex ext link ./extensions/worker-sql

#删除扩展
npx alex ext uninstall <pwd>  
```