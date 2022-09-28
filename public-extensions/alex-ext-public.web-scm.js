module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "web-scm",
    "version": "0.0.11"
  },
  "packageJSON": {
    "name": "web-scm",
    "publisher": "alex-ext-public",
    "version": "0.0.10",
    "displayName": "web-scm",
    "description": "SCM for Web",
    "activationEvents": [
      "*"
    ],
    "kaitianContributes": {
      "workerMain": "./out/worker/index.js"
    },
    "contributes": {
      "commands": [
        {
          "command": "git.commit",
          "title": "git commit",
          "icon": "$(check)",
          "category": "Git"
        },
        {
          "command": "git.refresh",
          "title": "git refresh",
          "icon": "$(refresh)",
          "category": "Git"
        },
        {
          "command": "git.branch",
          "title": "create branch",
          "icon": "$(branch)",
          "category": "Git"
        },
        {
          "command": "git.branchFrom",
          "title": "create branch from",
          "icon": "$(branch)",
          "category": "Git"
        },
        {
          "command": "git.openFile",
          "title": "git open file",
          "icon": "$(go-to-file)",
          "category": "Git"
        },
        {
          "command": "git.stage",
          "title": "git stage",
          "icon": "$(add)",
          "category": "Git"
        },
        {
          "command": "git.clean",
          "title": "git clean",
          "icon": "$(discard)",
          "category": "Git"
        },
        {
          "command": "git.cleanAll",
          "title": "git cleanAll",
          "icon": "$(discard)",
          "category": "Git"
        }
      ],
      "menus": {
        "scm/title": [
          {
            "command": "git.commit",
            "group": "navigation",
            "when": "scmProvider == webscm"
          },
          {
            "command": "git.refresh",
            "group": "navigation",
            "when": "scmProvider == webscm"
          },
          {
            "command": "git.branch",
            "when": "scmProvider == webscm && createBranchAble"
          },
          {
            "command": "git.branchFrom",
            "when": "scmProvider == webscm && createBranchAble"
          }
        ],
        "scm/resourceState/context": [
          {
            "command": "git.openFile",
            "when": "scmProvider == webscm",
            "group": "inline"
          },
          {
            "command": "git.clean",
            "when": "scmProvider == webscm",
            "group": "inline"
          }
        ],
        "scm/resourceGroup/context": [
          {
            "command": "git.cleanAll",
            "when": "scmProvider == webscm",
            "group": "inline"
          }
        ],
        "scm/change/title": [
          {
            "command": "git.cleanAll",
            "when": "originalResourceScheme == git"
          }
        ]
      },
      "colors": [
        {
          "id": "gitDecoration.addedResourceForeground",
          "description": "%colors.added%",
          "defaults": {
            "light": "#587c0c",
            "dark": "#81b88b",
            "highContrast": "#1b5225",
            "highContrastLight": "#374e06"
          }
        },
        {
          "id": "gitDecoration.modifiedResourceForeground",
          "description": "%colors.modified%",
          "defaults": {
            "light": "#895503",
            "dark": "#E2C08D",
            "highContrast": "#E2C08D",
            "highContrastLight": "#895503"
          }
        },
        {
          "id": "gitDecoration.deletedResourceForeground",
          "description": "%colors.deleted%",
          "defaults": {
            "light": "#ad0707",
            "dark": "#c74e39",
            "highContrast": "#c74e39",
            "highContrastLight": "#ad0707"
          }
        },
        {
          "id": "gitDecoration.renamedResourceForeground",
          "description": "%colors.renamed%",
          "defaults": {
            "light": "#007100",
            "dark": "#73C991",
            "highContrast": "#73C991",
            "highContrastLight": "#007100"
          }
        },
        {
          "id": "gitDecoration.untrackedResourceForeground",
          "description": "%colors.untracked%",
          "defaults": {
            "light": "#007100",
            "dark": "#73C991",
            "highContrast": "#73C991",
            "highContrastLight": "#007100"
          }
        },
        {
          "id": "gitDecoration.ignoredResourceForeground",
          "description": "%colors.ignored%",
          "defaults": {
            "light": "#8E8E90",
            "dark": "#8C8C8C",
            "highContrast": "#A7A8A9",
            "highContrastLight": "#8e8e90"
          }
        },
        {
          "id": "gitDecoration.stageModifiedResourceForeground",
          "description": "%colors.stageModified%",
          "defaults": {
            "light": "#895503",
            "dark": "#E2C08D",
            "highContrast": "#E2C08D",
            "highContrastLight": "#895503"
          }
        },
        {
          "id": "gitDecoration.stageDeletedResourceForeground",
          "description": "%colors.stageDeleted%",
          "defaults": {
            "light": "#ad0707",
            "dark": "#c74e39",
            "highContrast": "#c74e39",
            "highContrastLight": "#ad0707"
          }
        },
        {
          "id": "gitDecoration.conflictingResourceForeground",
          "description": "%colors.conflict%",
          "defaults": {
            "light": "#ad0707",
            "dark": "#e4676b",
            "highContrast": "#c74e39",
            "highContrastLight": "#ad0707"
          }
        },
        {
          "id": "gitDecoration.submoduleResourceForeground",
          "description": "%colors.submodule%",
          "defaults": {
            "light": "#1258a7",
            "dark": "#8db9e2",
            "highContrast": "#8db9e2",
            "highContrastLight": "#1258a7"
          }
        }
      ],
      "keybindings": [
        {
          "command": "git.commit",
          "key": "ctrl+enter",
          "mac": "cmd+enter",
          "when": "scmRepository"
        }
      ],
      "workerMain": "./out/worker/index.js"
    }
  },
  "defaultPkgNlsJSON": {
    "common.cancel": "Cancel",
    "common.certain": "Certain",
    "alex.git.refresh": "git refresh",
    "alex.git.inputBox.placeholder": "Message ({0}  commit and push directly)",
    "changes": "Changes",
    "staged.changes": "Staged Changes",
    "merge.changes": "Merge Changes",
    "untracked.changes": "Untracked Changes",
    "git.title.workingTree": "{0} (WorkingTree)",
    "git.title.untracked": "{0} (Untracked)",
    "git.title.deleted": "{0} (Deleted)",
    "git.title.added": "{0} (Added)",
    "git error details": "Git Error",
    "deleted": "Deleted",
    "added": "Added",
    "modified": "Modified",
    "diff": "Diff",
    "discard": "Discard Changes",
    "confirm delete": "Are you sure you want to DELETE {0}?\nThis is IRREVERSIBLE!\nThis file will be FOREVER LOST if you proceed.",
    "restore file": "Restore file",
    "confirm restore": "Are you sure you want to restore {0}?",
    "confirm discard": "Are you sure you want to discard changes in {0}?",
    "delete file": "Delete file",
    "delete files": "Delete Files",
    "restore files": "Restore files",
    "confirm restore multiple": "Are you sure you want to restore {0} files?",
    "confirm discard multiple": "Are you sure you want to discard changes in {0} files?",
    "warn untracked": "This will DELETE {0} untracked files!\nThis is IRREVERSIBLE!\nThese files will be FOREVER LOST.",
    "there are untracked files single": "The following untracked file will be DELETED FROM DISK if discarded: {0}.",
    "there are untracked files": "There are {0} untracked files which will be DELETED FROM DISK if discarded.",
    "confirm discard all 2": "{0}\n\nThis is IRREVERSIBLE, your current working set will be FOREVER LOST.",
    "yes discard tracked": "Discard 1 Tracked File",
    "yes discard tracked multiple": "Discard {0} Tracked Files",
    "discardAll": "Discard All {0} Files",
    "confirm discard all single": "Are you sure you want to discard changes in {0}?",
    "confirm discard all": "Are you sure you want to discard ALL changes in {0} files?\nThis is IRREVERSIBLE!\nYour current working set will be FOREVER LOST if you proceed.",
    "discardAll multiple": "Discard 1 File",
    "confirm delete multiple": "Are you sure you want to DELETE {0} files?\nThis is IRREVERSIBLE!\nThese files will be FOREVER LOST if you proceed.",
    "commit message": "Commit message",
    "provide commit message": "Please provide a commit message",
    "commit success": "Commit to {0} success \n Whether to go to {1} to create a PR",
    "commit failed": "Commit failed",
    "confirm stage files with merge conflicts": "Are you sure you want to stage {0} files with merge conflicts",
    "confirm stage file with merge conflicts": "Are you sure you want to stage {0} with merge conflicts?"
  },
  "pkgNlsJSON": {
    "zh-CN": {
      "common.cancel": "取消",
      "common.certain": "确定",
      "common.toplatform": "提交成功，是否去 {0} 创建 PR",
      "alex.git.refresh": "git refresh",
      "alex.git.inputBox.placeholder": "消息({0} 直接提交并推送) ",
      "changes": "更改",
      "staged.changes": "暂存的更改",
      "merge.changes": "合并的更改",
      "untracked.changes": "未追踪的更改",
      "git.title.workingTree": "{0} (工作树)",
      "git.title.untracked": "{0} (未追踪)",
      "git.title.deleted": "{0} (已删除)",
      "git.title.added": "{0} (新增)",
      "git error details": "Git Error",
      "deleted": "已删除",
      "added": "新增",
      "modified": "修改",
      "diff": "更改",
      "discard": "放弃更改",
      "confirm delete": "确定要删除 {0} 吗?",
      "restore file": "恢复文件",
      "confirm restore": "确认是否还原 {0}",
      "confirm discard": "确定要放弃 {0} 中更改吗?",
      "delete file": "删除文件",
      "delete files": "删除文件",
      "restore files": "还原文件",
      "confirm restore multiple": "确认还原 {0} 个文件?",
      "confirm discard multiple": "确认放弃在 {0} 个文件中的更改?",
      "warn untracked": "确认删除 {0} 个文件!\nT此操作不可撤消!文件将被永久删除。",
      "there are untracked files single": "若放弃下面未跟踪的文件，其将被从硬盘上删除: {0}。",
      "there are untracked files": "若放弃 {0} 个未跟踪的文件，其将被从硬盘上删除。",
      "confirm discard all 2": "{0}\n\n此操作不可撤销，你当前的工作集将会永远丢失。",
      "yes discard tracked": "放弃1个文件",
      "yes discard tracked multiple": "放弃 {0} 个追踪的文件",
      "discardAll": "放弃 所有 {0} 个文件",
      "confirm discard all single": "确定放弃 {0} 中的更改吗?",
      "confirm discard all": "确定要放弃在 {0} 个文件中的所有更改吗？此操作不可撤销!你当前的工作集将会永远丢失。",
      "discardAll multiple": "放弃1个文件",
      "confirm delete multiple": "确认删除 {0} 个文件!\nT此操作不可撤消!文件将被永久删除。",
      "commit message": "提交信息",
      "provide commit message": "请输入提交信息",
      "commit success": "向分支 {0} 提交成功",
      "commit failed": "提交失败",
      "confirm stage files with merge conflicts": "确定要暂存含有合并冲突的 {0} 个文件吗?",
      "confirm stage file with merge conflicts": "确定要暂存含有合并冲突的 {0}  吗?"
    }
  },
  "nlsList": [
    {
      "filename": "package.nls.zh-cn.json",
      "languageId": ".zh-cn"
    }
  ],
  "extendConfig": {},
  "webAssets": [
    "package.json",
    "out/worker/index.js"
  ],
  "mode": "public"
}
