import { IPluginAPI } from '@codeblitzjs/ide-core/lib/editor';
import { io, Socket } from 'socket.io-client';
import 'antd/lib/message/style'
import message from 'antd/lib/message'

export enum COLLABORATION_COMMAND {
  Reconnect = 'collaboration.reconnect',
  Initialize = 'collaboration.initialize',
  Initialized = 'collaboration.initialized',
  SendOperation = 'collaboration.sendOperation',
  ApplyOperation = 'collaboration.applyOperation',
  SendSelection = 'collaboration.sendSelection',
  ApplySelection = 'collaboration.applySelection',
  Join = 'collaboration.join',
  Leave = 'collaboration.leave',
  SyncState = 'collaboration.syncState',
}

class Deferred<T> {
  resolve: (value: T) => void;
  reject: (err?: any) => void;

  promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve;
    this.reject = reject;
  });
}

const extReady = new Deferred<void>();
const initStateReady = new Deferred<any>();
const initializedStateReady = new Deferred<void>();
export const commandReady = new Deferred<IPluginAPI['commands']>();
export let commands: IPluginAPI['commands'];


let socket: Socket | null = null;
const currentUser = {
  name: '',
  userId: Math.ceil(Math.random() * 10000),
}

export const initSocket = (name: string) => {
  currentUser.name = name;
  socket = io(`http://${process.env.HOST || 'localhost'}:9099`);
  socket
    .on('connect', async () => {
      socket!.emit('join', currentUser)
      socket!.emit('state', (data) => {
        initStateReady.resolve({
          status: 'success',
          data: {
            ...currentUser,
            revision: data.revision,
            code: data.code,
            mode: 'javascript',
          },
        });
      });
    })
    .on('join', (data) => {
      initializedStateReady.promise.then(() => {
        commands.executeCommand(COLLABORATION_COMMAND.Join, data);
      })
      message.info(`${data.name} 加入了`)
    })
    .on('leave', (data) => {
      initializedStateReady.promise.then(() => {
        commands.executeCommand(COLLABORATION_COMMAND.Leave, data?.userId);
      })
      message.info(`${data.name} 离开了`)
    })
    .on('reconnect', async () => {
      executeCommand(COLLABORATION_COMMAND.Reconnect);
    })
    .on('operation', (data) => {
      executeCommand(COLLABORATION_COMMAND.ApplyOperation, data);
    })
    .on('selection', (data) => {
      executeCommand(COLLABORATION_COMMAND.ApplySelection, data);
    });
}

const executeCommand = async (commandId: COLLABORATION_COMMAND, data?: any) => {
  await extReady.promise;
  commands.executeCommand(commandId, data);
};

export const PLUGIN_ID = 'live';

export const activate = ({ context, commands: commands_ }: IPluginAPI) => {
  commands = commands_;

  commandReady.resolve(commands_);

  context.subscriptions.push(
    commands.registerCommand(COLLABORATION_COMMAND.Initialize, async () => {
      extReady.resolve();
      return initStateReady.promise;
    }),

    commands.registerCommand(COLLABORATION_COMMAND.Initialized, () => {
      initializedStateReady.resolve();
    }),

    commands.registerCommand(COLLABORATION_COMMAND.SyncState, async () => {
      return new Promise((resolve) => {
        socket?.emit('state', resolve);
      });
    }),

    commands.registerCommand(COLLABORATION_COMMAND.SendOperation, (data) => {
      return new Promise<void>((resolve, reject) => {
        socket?.emit('operation', { ...data, ...currentUser }, (success) => {
          if (success) {
            resolve();
          } else {
            reject();
          }
        });
      });
    }),

    commands.registerCommand(COLLABORATION_COMMAND.SendSelection, (data) => {
      return new Promise((resolve, reject) => {
        socket?.emit('selection', { ...data, ...currentUser }, resolve);
      });
    })
  );
};
