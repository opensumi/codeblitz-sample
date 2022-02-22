# alex-demo

## [Alex对接文档](https://yuque.antfin.com/cloud-ide/alex/ad0sp7)

## Usage
```bash
# IDE 示例
npm run start

# 查看 sql-editor 示例 需先模拟下载sql本地插件
npx alex ext link ./extensions/worker-sql
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