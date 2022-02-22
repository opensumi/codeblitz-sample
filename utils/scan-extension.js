const path = require('path');
const fs = require('fs/promises');
const { ExtensionScanner } = require('@ali/ide-kaitian-extension/lib/node/extension.scanner');
const { getExtension } = require('@alipay/alex-cli/lib/extension/scanner');
const { Uri } = require('@ali/ide-core-common');

/**
 * @param {string} p
 */
const pathExists = (p) =>
  fs
    .access(p)
    .then(() => true)
    .catch(() => false);

exports.getLocalExtensions = async () => {
  const dirList = [];
  const extensionDir = path.join(__dirname, '../extensions');
  if (await pathExists(extensionDir)) {
    dirList.push(extensionDir);
  }
  const extensionScanner = new ExtensionScanner(dirList, 'en-US', [], {});
  return extensionScanner.run();
};

exports.getLocalExtensionsMetadata = async (host, basePath) => {
  const dirList = [];
  const extensionDir = path.join(__dirname, '../extensions');
  await Promise.all(
    [extensionDir].map(async (dir) => {
      if (await pathExists(dir)) {
        const files = await fs.readdir(dir, { withFileTypes: true });
        files.forEach((dirent) => {
          if (dirent.isDirectory()) {
            dirList.push(path.join(dir, dirent.name));
          }
        });
      }
    })
  );
  const httpUri = Uri.parse(host).with({ path: basePath });
  return Promise.all(dirList.map((localExtPath) => getExtension(localExtPath, 'local', httpUri)));
};
