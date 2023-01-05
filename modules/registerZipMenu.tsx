import { ToolBarRightBtn } from '../components/zipButton';
import { requireModule } from "@alipay/alex/bundle";
const FileService = requireModule("@opensumi/ide-file-service");
const CommpnDI = requireModule("@opensumi/di");
const CoreBrowser = requireModule("@opensumi/ide-core-browser");

const { Injectable } = CommpnDI;
const { Domain, BrowserModule, SlotLocation, ToolBarActionContribution, MenuId} = CoreBrowser;

export const getDefaultLayoutConfig = () => ({
  [SlotLocation.top]: {
    modules: ['@opensumi/ide-menu-bar'],
  },
  [SlotLocation.action]: {
    modules: [''],
  },
  [SlotLocation.left]: {
    modules: ['@opensumi/ide-explorer', '@opensumi/ide-search'],
  },
  [SlotLocation.main]: {
    modules: ['@opensumi/ide-editor'],
  },
  [SlotLocation.bottom]: {
    modules: ['@opensumi/ide-output', '@opensumi/ide-markers'],
  },
  [SlotLocation.statusBar]: {
    modules: ['@opensumi/ide-status-bar'],
  },
  [SlotLocation.extra]: {
    modules: ['breadcrumb-menu'],
  },
  [SlotLocation.action]: {
    modules: ['@opensumi/ide-toolbar-action'],
  }
});


@Domain(ToolBarActionContribution)
class RegisterMenuContribution {
  registerToolbarActions(registry) {
    registry.addLocation('menu-right');
    registry.setDefaultLocation('menu-right');

    registry.registerToolbarAction({
      description: 'zip下载',
      component: ToolBarRightBtn,
      id: 'toolbar-right-btn',
      weight: 1,
      preferredPosition: {
        location: 'menu-right',
      },
      neverCollapse: true,
    });
  }
  registerMenus(menus) {
    // 由于目前 toolbar 尚未处理插件自定义组件展示，因此先卸载掉toolbar的右键
    menus.unregisterMenuId(MenuId.KTToolbarLocationContext);
  }
}

@Injectable()
export class RegisterZipMenuModule extends BrowserModule {
  providers = [RegisterMenuContribution];
}