import { Provider, Injectable, Autowired } from '@opensumi/di';
import {
  Domain,
  BrowserModule,
  CommandContribution,
  CommandRegistry,
  getLanguageId,
  Disposable,
  CommandService,
  Uri,
  URI,
  getIcon,
} from '@opensumi/ide-core-browser';
import { CodeModelService } from '@codeblitzjs/ide-code-service';
import { SCHEME, toMergeUris, workspaceDir } from './util';
import { WORKSPACE_ROOT } from '@codeblitzjs/ide-sumi-core';

@Domain(CommandContribution)
export class MergeEditorContribution extends Disposable implements CommandContribution {
  @Autowired()
  codeModel: CodeModelService;

  @Autowired(CommandService)
  commandService: CommandService;

  registerCommands(commands: CommandRegistry): void {
    this.addDispose([
      commands.registerCommand(
        { id: 'merge-editor.resolve-conflicts', label: '合并解决冲突' },
        {
          execute: async () => {

            const workspaceUri = URI.file(`${WORKSPACE_ROOT}/${workspaceDir}`);
            const mockUri = workspaceUri.resolve('merge-editor/ancestor.mock.js');

            type InputData = { uri: Uri; title?: string; detail?: string; description?: string };
            const mergeUris = toMergeUris(mockUri.codeUri);

            const current: InputData = { uri: mergeUris.ours, title: 'Current' };
            const incoming: InputData = { uri: mergeUris.theirs, title: 'Incoming' };

            const options = {
              ancestor: mergeUris.base,
              input1: current,
              input2: incoming,
              output: mockUri.codeUri
            };

            await this.commandService.executeCommand(
              '_open.mergeEditor',
              options
            );
          },
        }
      ),
    ]);
  }
}

@Injectable()
export class MergeEditorModule extends BrowserModule {
  providers: Provider[] = [MergeEditorContribution];
}
