import { URI, Uri } from '@opensumi/ide-core-browser';

export const SCHEME = 'web_scm';
export const workspaceDir = 'codeblitz-resolve-conflicts';

export interface GitUriParams {
    path: string;
    ref: string;
    submoduleOf?: string;
}

export interface WebUriOptions {
    replaceFileExtension?: boolean;
    submoduleOf?: string;
}

export function toWebUri(uri: Uri, ref: string, options: WebUriOptions = {}): Uri {
    const params: GitUriParams = {
        path: uri.fsPath,
        ref
    };

    if (options.submoduleOf) {
        params.submoduleOf = options.submoduleOf;
    }

    let path = uri.path;

    return uri.with({
        scheme: 'file',
        path,
        query: JSON.stringify(params)
    });
}
export function toMergeUris(uri: Uri): { base: Uri; ours: Uri; theirs: Uri } {
    const newUri = URI.file(uri.fsPath)
    console.log(newUri)
    return {
        // :1 :2 :3 
        base: toWebUri(uri, ':1'),
        ours: toWebUri(uri, ':2').with({ path: newUri.parent.resolve('input1.mock.js').codeUri.fsPath }),
        theirs: toWebUri(uri, ':3').with({ path: newUri.parent.resolve('input2.mock.js').codeUri.fsPath }),
    };
}

export const SEPARATOR = '/';
