import React from "react";
import { requireModule } from "@codeblitzjs/ide-core/bundle";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { FullScreenToken } from "../zip";
export interface FileStat {
  /**
   * 资源路径
   */
  uri: string;

  /**
   * 资源最后修改时间
   */
  lastModification: number;

  /**
   * 资源的创建时间
   */
  createTime?: number;

  /**
   * 资源是否为文件夹
   */
  isDirectory: boolean;

  /**
   * 资源是否为软连接
   */
  isSymbolicLink?: boolean;

  /**
   * 资源是否在软连接文件夹内
   */
  isInSymbolicDirectory?: boolean;

  /**
   * The children of the file stat.
   * If it is `undefined` and `isDirectory` is `true`, then this file stat is unresolved.
   */
  children?: FileStat[];

  /**
   * The size of the file if known.
   */
  size?: number;

  /**
   * 同 vscode FileType
   */
  type?: FileType;

  /**
   * 当前文件是否为只读
   */
  readonly?: boolean;
}

export enum FileType {
  /**
   * The file type is unknown.
   */
  Unknown = 0,
  /**
   * A regular file.
   */
  File = 1,
  /**
   * A directory.
   */
  Directory = 2,
  /**
   * A symbolic link to a file.
   */
  SymbolicLink = 64,
}

export interface MapStat {
  /**
   * 资源路径
   */
  uri: string;

  /**
   * 资源是否为文件夹
   */
  isDirectory: boolean;

  /**
   * 同 vscode FileType
   */
  type?: FileType;

  content: string | null;
  children?: FileStat[];
}
const FileService = requireModule("@opensumi/ide-file-service");
const CoreBrowser = requireModule("@opensumi/ide-core-browser");
const CommpnDI = requireModule("@opensumi/di");

const fs = requireModule("fs");
const { Injectable, Injector } = CommpnDI;

const { Button } = requireModule("@opensumi/ide-components");

const { useInjectable, URI, CommandService} = CoreBrowser;

let fileMap = new Map<string, MapStat>();

export async function getAllFiles(path: string, fileService) {
  if (path.includes("node_modules")) {
    return;
  }
  const uri = URI.parse(path).toString();
  const res: FileStat = await fileService.getFileStat(uri);
  // @ts-ignore
  let content: null | BinaryBuffer = null;
  if (!res.isDirectory) {
    content = await fileService.readFile(uri);
  }

  fileMap.set(uri, {
    uri: res.uri,
    isDirectory: res.isDirectory,
    type: res.type,
    content: content ? content.content.toString() : null,
    children: res.children,
  });

  if (res) {
    if (res.isDirectory) {
      const promiseAll = res.children!.map((child) => {
        return getAllFiles(child.uri, fileService);
      });
      await Promise.all(promiseAll);
    }
  }
}

// zip 打包
export const click = async (fileService) => {
  fileMap = new Map<string, MapStat>();
  // 获取所有文件列表
  await getAllFiles(rootDir, fileService);
  console.log(fileMap);
  const zip = new JSZip();
  for (let [key, value] of fileMap.entries()) {
    const fullPath = key.slice(rootDir.length + 1);
    const name = fullPath.split("/").pop();
    if (value.isDirectory && value.children?.length) {
      zip.folder(fullPath);
    } else {
      zip.file(fullPath, value.content as string);
    }
  }

  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "test1.zip");
  });
};


export const rootDir = "file:///workspace/zip_file_system";

export function FullScreenBtn() {
  const commandService = useInjectable(CommandService);

  const click = async () => {
    commandService.executeCommand('alex.zip.setFullScreen')
  }
  return (
    <div>
      <Button type="default" onClick={() => click()}>
        全屏
      </Button>
    </div>
  );
}
