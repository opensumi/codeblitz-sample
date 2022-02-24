# worker-sql 插件

# 使用antlr 需使用 anltr 命令解析 g4 文件

```bash
curl -O https://www.antlr.org/download/antlr-4.7.1-complete.jar

java -jar antlr-4.7.1-complete.jar  # 启动org.antlr.v4.Tool

java org.antlr.v4.Tool -Dlanguage=JavaScript test.g4 # 解析后会自动生成语法文件 ./src/extend/worker/antlr
```