import { commands, workspace, ExtensionContext } from 'vscode';
import { PREFERENCE_COMMAND, PreferenceConfig } from './types';

export const initializePreferenceCommands = (context: ExtensionContext) => {
  context.subscriptions.push(
    commands.registerCommand(PREFERENCE_COMMAND.Preference, (list: PreferenceConfig) => {
      list.forEach(([type, value]) => {
        if (type === 'fontSize') {
          workspace.getConfiguration().update('editor.fontSize', value, true);
        } else if (type === 'tabSize') {
          workspace.getConfiguration().update('editor.tabSize', value, true);
        } else if (type === 'theme') {
          const themeType = value === 'dark' ? 'opensumi-design-dark-theme' : 'opensumi-design-light-theme';
          workspace.getConfiguration().update('general.theme', themeType, true);
        }
      });
    })
  );
};
