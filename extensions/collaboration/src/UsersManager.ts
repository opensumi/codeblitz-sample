import * as vscode from 'vscode';
import { UserProfile, UserSelection } from './types';

export class UsersManager {
  private users: Record<number, UserProfile> = {};
  private selections: Record<number, UserSelection[]> = {};

  constructor(private currentUser: UserProfile) {
    this.users[currentUser.userId] = currentUser;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  get currentUserId() {
    return this.getCurrentUser().userId;
  }

  getUser(id: number): UserProfile | undefined {
    return this.users[id];
  }

  addUser(user: UserProfile) {
    this.users[user.userId] = user;
  }

  removeUser(userId: number) {
    delete this.users[userId];
  }

  setSelection(id: number, selections: UserSelection[]) {
    this.selections[id] = selections || [];
  }

  getSelection(id: number): UserSelection[] | undefined {
    return this.selections[id];
  }

  removeSelection(id: number) {
    delete this.selections[id];
  }
}
