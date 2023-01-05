import { IPluginAPI, IPluginModule } from '@alipay/alex/lib/editor';

export class Plugin implements IPluginModule {
  PLUGIN_ID = 'PLUGIN_TEST';

  private _commands: IPluginAPI['commands'] | null = null;

  get commands() {
    return this._commands;
  }
  fullScreenOff: ()=> void
  fullScreenOn: ()=> void
  fullScreenStatus: boolean
  constructor(
    fullScreenOn: () => void,
    fullScreenOff:()=> void,
    fullScreenStatus: boolean
  ) {
    this.fullScreenOn = fullScreenOn;
    this.fullScreenOff = fullScreenOff;
    this.fullScreenStatus = fullScreenStatus
  }

  activate({ context, commands }: IPluginAPI) {
    this._commands = commands;
    context.subscriptions.push(
      commands.registerCommand('alex.zip.setFullScreen', (x: number) => {
        if(this.fullScreenStatus){
          this.fullScreenOff()
        }else {
          this.fullScreenOn()
        }
        this.fullScreenStatus = !this.fullScreenStatus
        return 
      })
    );
  }
}

export default Plugin