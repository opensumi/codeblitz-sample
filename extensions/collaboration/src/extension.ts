import { workspace, window, ExtensionContext } from 'vscode';

import { Live } from './Live';
import { joinPath, FILE_NAME, t, logError } from './utils';
import { initializePreferenceCommands } from './preference';

export const activate = async (context: ExtensionContext) => {
  console.log('InitializeState');
  const { workspaceFolders } = workspace;
  if (!workspaceFolders?.[0]) {
    // 应该不会发生这样情况，仅保证程序正确性
    window.showErrorMessage(t(['workspace is empty', '工作空间为空']));
    return;
  }
  const workspaceRoot = workspaceFolders[0];
  const docUri = joinPath(workspaceRoot.uri, FILE_NAME);

  initializePreferenceCommands(context);
  new Live(context).initialize(docUri).catch((err) => {
    logError(err);
    window.showErrorMessage(
      t(['initialize error, please refresh and retry again', '初始化错误，请刷新浏览器重试'])
    );
  });
};
