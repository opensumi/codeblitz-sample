import { Injectable, Provider, Autowired } from '@opensumi/di';
import { BrowserModule, CommandContribution, CommandRegistry, Disposable, Domain, AppConfig } from '@opensumi/ide-core-browser';
import { MenuContribution, IMenuRegistry, MenuId } from '@opensumi/ide-core-browser/lib/menu/next';

import { ComponentMenuGroupDivider } from './ComponentMenuGroupDivider';


const TESTCOMMAND = {
  id: 'testcommand',
}


@Domain(CommandContribution, MenuContribution)
export class RegisterMenuContribution implements CommandContribution, MenuContribution {
  @Autowired(AppConfig)
  appConfig: AppConfig;
  registerMenus(menus: IMenuRegistry): void {
    // 注册到 EditorTitle 
    menus.registerMenuItem(MenuId.EditorTitle, {
      command: TESTCOMMAND.id,
      order: 100,
      group: 'navigation',
      when: 'true',
    });
    menus.registerMenuItem(MenuId.EditorTitle, {
      component: ComponentMenuGroupDivider,
      order: 100,
      group: 'navigation',
      when: 'true',
    });
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(
      { id: TESTCOMMAND.id },
      {
        execute: () => {
          console.log('test command')
        },
      })
  }

}

@Injectable()
export class RegisterMenuModule extends BrowserModule {

  providers: Provider[] = [RegisterMenuContribution];

}