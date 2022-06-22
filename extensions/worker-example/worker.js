const { commands } = require('vscode');
const log = (scope, ...msg) => console.log(`>>>[worker-example][${scope}]`, ...msg);

/** @type {import('vscode').ExtensionContext} */
let context;

exports.activate = async (ctx) => {
  context = ctx;

  log('start');

  // 注册菜单的命令
  commands.registerCommand('test.registerMenu', () => {
    log('执行注册菜单命令')
  })

  commands.registerCommand('plugin.command.test', async () => {
    commands.registerCommand('plugin.command.say', (msg) => {
      log('plugin', msg);
    });
    log('plugin', await commands.executeCommand('plugin.command.add', 1));
  });
};
