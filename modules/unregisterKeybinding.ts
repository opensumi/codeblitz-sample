// 解绑 Keybinding 以及 Menu
import { requireModule } from "@alipay/alex/bundle";
const CommpnDI = requireModule("@opensumi/di");
const CoreBrowser = requireModule("@opensumi/ide-core-browser");

const { Injectable } = CommpnDI;
const { Domain, BrowserModule,MenuContribution, CommandContribution,KeybindingContribution} = CoreBrowser;
interface IMenuRegistry {
  unregisterMenuItem(menuId: string, menuItemId: string): void;
}
interface KeybindingRegistry {
  unregisterKeybinding(keyOrBinding:string): void;
}

@Domain(KeybindingContribution, MenuContribution)
export class KeybindContribution
  // implements KeybindingContribution, MenuContribution
{
  // 命令解绑
  // 也可疑通过 RuntimeConfig 内 unregisterKeybindings 方法注销
  registerKeybindings(keybindings: KeybindingRegistry) {
    const keybindingList = [
      'ctrlcmd+,',
      'ctrlcmd+shift+p',
      'ctrlcmd+p',
      'F1',
      'alt+n',
      'alt+shift+t',
      'alt+shift+w',
      'ctrlcmd+\\',
      'ctrlcmd+o',
    ];
    for (let i = 1; i < 10; i++) {
      keybindingList.push(`ctrlcmd+${i}`);
    }

    keybindingList.forEach((binding) => {
      keybindings.unregisterKeybinding(binding);
    });
  }
  registerMenus(menus: IMenuRegistry): void {
    // 移除 quickopen
    menus.unregisterMenuItem('editor/context', 'editor.action.quickCommand');
    // menus.unregisterMenuItem(MenuId.EditorContext, QUICK_OPEN_COMMANDS.OPEN.id);
  }
}

@Injectable()
export class unregisterKeybindingModule extends BrowserModule {
  providers = [KeybindContribution];
}