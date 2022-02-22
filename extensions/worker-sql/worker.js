const { commands, Uri, workspace, languages } = require("vscode");
const vscode = require("vscode");

const log = (scope, ...msg) =>
  console.log(`>>>[worker-example][${scope}]`, ...msg);

function stringToUint8Array(str) {
  var arr = [];
  for (var i = 0, j = str.length; i < j; ++i) {
    arr.push(str.charCodeAt(i));
  }
  var tmpUint8Array = new Uint8Array(arr);
  return tmpUint8Array;
}

exports.activate = async (context) => {
  log("start sql");
  const rootDir = workspace.workspaceFolders[0].uri;
  const docUri = Uri.joinPath(rootDir, "test.sql");
  const document = stringToUint8Array("SELECT * FROM  a");
  // 创建文件
  workspace.fs
    .writeFile(docUri, document, { create: true, overwrite: true })
    .then((res) => {
      console.log('res',res)
      commands.executeCommand("vscode.open", docUri, {
        preview: false,
      });
    });

  const keys = [
    "ADD",
    "ADD CONSTRAINT",
    "ALTER",
    "ALTER COLUMN",
    "ALTER TABLE",
    "ALL",
    "AND",
    "ANY",
    "AS",
    "ASC",
    "BACKUP DATABASE",
    "BETWEEN",
    "CASE",
    "CHECK",
    "COLUMN",
    "CONSTRAINT",
    "CREATE",
    "CREATE DATABASE",
    "CREATE INDEX",
    "CREATE OR REPLACE VIEW",
    "CREATE TABLE",
    "CREATE PROCEDURE",
    "CREATE UNIQUE INDEX",
    "CREATE VIEW",
    "DATABASE",
    "DEFAULT",
    "DELETE",
    "DESC",
    "DISTINCT",
    "DROP",
    "DROP COLUMN",
    "DROP CONSTRAINT",
    "DROP DATABASE",
    "DROP DEFAULT",
    "DROP INDEX",
    "DROP TABLE",
    "DROP VIEW",
    "EXEC",
    "EXISTS",
    "FOREIGN KEY",
    "FROM",
    "FULL OUTER JOIN",
    "GROUP BY",
    "HAVING",
    "IN",
    "INDEX",
    "INNER JOIN",
    "INSERT INTO",
    "INSERT INTO SELECT",
    "IS NULL",
    "IS NOT NULL",
    "JOIN",
    "LEFT JOIN",
    "LIKE",
    "LIMIT",
    "NOT",
    "NOT NULL",
    "OR",
    "ORDER BY",
    "OUTER JOIN",
    "PRIMARY KEY",
    "PROCEDURE",
    "RIGHT JOIN",
    "ROWNUM",
    "SELECT",
    "SELECT DISTINCT",
    "SELECT INTO",
    "SELECT TOP",
    "SET",
    "TABLE",
    "TOP",
    "TRUNCATE TABLE",
    "UNION",
    "UNION ALL",
    "UNIQUE",
    "UPDATE",
    "VALUES",
    "VIEW",
    "WHERE"
  ];

  const functions = [
    "AVG()",
    "SUM()",
    "COUNT()",
    "MAX()",
    "MIN()",
    "CONCAT()",
    "CONCAT_WS()",
    "FORMAT()",
    "LOWER()",
    "UPPER()",
    "TRIM()",
    "REVERSE()",
    "SUBSTRING()",
    "NOW()",
    "CURDATE()",
    "CURTIME()",
    "DATE()",
    "DAY()",
    "DAYNAME()",
    "MONTH()",
    "MONTHNAME()",
    "YEAR()",
    "DATE_FORMAT()",
    "EXTRACT()",
    "DATE_ADD()",
    "DATE_SUB()",
    "DATEDIFF()",
    "GETDATE()",
    "DATEPART()",
    "DAY()",
    "MONTH()",
    "YEAR()",
    "DATEADD()",
    "DATEDIFF()",
    "CONVERT()"
  ];

  const keyCompletionItems = keys.map((key) => new vscode.CompletionItem(key, vscode.CompletionItemKind.Keyword))
  
  const functionCompletionItems = functions.map((func) => new vscode.CompletionItem(func, vscode.CompletionItemKind.Function))

  // sql语言服务
  const keyProvider = languages.registerCompletionItemProvider(
    {language: 'sql'},
    {
      provideCompletionItems(document, position, token, context) {
        console.log('provideCompletionItems',document,position,token,context)
        return [...keyCompletionItems,...functionCompletionItems]
      },
      resolveCompletionItem(item,token){
        console.log('resolveCompletionItem',item,token)
      }
    }
  );
	context.subscriptions.push(keyProvider);
};
