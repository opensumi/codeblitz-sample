import { Range } from 'vscode';
import { SerializedTextOperation } from './ot';

export interface UserId {
  userId: number;
}

export interface UserProfile extends UserId {
  name: string;
}

export interface UserSelection {
  range: Range;
  isReversed: boolean;
}

export interface DocState {
  revision: number;
  code: string;
  mode?: string;
}

export type InitializeState =
  | {
      status: 'success';
      data: UserProfile & DocState;
    }
  | {
      status: 'fail';
    };

export interface SendOperationType {
  ops: SerializedTextOperation;
  revision: number;
}

export interface SendSelectionType {
  selection: Array<{
    offset: [number, number];
    isReversed: boolean;
  }>;
}

export interface ApplyOperationType extends SendOperationType, UserId {}

export interface ApplySelectionType extends SendSelectionType, UserId {}

export enum LIVE_COMMAND {
  Reconnect = 'collaboration.reconnect',
  Initialize = 'collaboration.initialize',
  Initialized = 'collaboration.initialized',
  SendOperation = 'collaboration.sendOperation',
  ApplyOperation = 'collaboration.applyOperation',
  SendSelection = 'collaboration.sendSelection',
  ApplySelection = 'collaboration.applySelection',
  Join = 'collaboration.join',
  Leave = 'collaboration.level',
  SyncState = 'collaboration.syncState',
  UpdateUser = 'collaboration.updateUser',
}

export enum PREFERENCE_COMMAND {
  Language = 'alitcode.setLanguage',
  Preference = 'alitcode.preference',
}

export enum COMMON_COMMAND {
  Report = 'alitcode.report',
}

export type PreferenceType = 'fontSize' | 'tabSize' | 'theme';

export type PreferenceConfig = [PreferenceType, any][];

export enum REPORT_NAME {
  SyncState = 'syncState',
  SyncStateFail = 'syncStateFail',
}
