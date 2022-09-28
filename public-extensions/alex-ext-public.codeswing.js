module.exports = {
  "extension": {
    "publisher": "alex-ext-public",
    "name": "codeswing",
    "version": "0.0.21"
  },
  "packageJSON": {
    "name": "codeswing",
    "publisher": "codespaces-contrib",
    "version": "0.0.21",
    "repository": {
      "type": "git",
      "url": "https://github.com/lostintangent/codeswing"
    },
    "displayName": "CodeSwing",
    "description": "Interactive coding playground for building web applications (aka swings).",
    "icon": "images/icon.png",
    "activationEvents": [
      "onCommand:codeswing.newSwing",
      "onCommand:codeswing.newSwingDirectory",
      "onCommand:codeswing.newSwingFromLastTemplate",
      "onCommand:codeswing.openSwing",
      "onCommand:codeswing.openSwingInNewWindow",
      "workspaceContains:codeswing.json",
      "onStartupFinished"
    ],
    "contributes": {
      "commands": [
        {
          "command": "codeswing.addLibrary",
          "title": "Add Library",
          "category": "CodeSwing",
          "icon": "$(library)"
        },
        {
          "command": "codeswing.addSwingFile",
          "title": "Add File",
          "icon": "$(add)"
        },
        {
          "command": "codeswing.changeLayout",
          "title": "Change Layout",
          "category": "CodeSwing",
          "icon": "$(editor-layout)"
        },
        {
          "command": "codeswing.deleteSwingFile",
          "title": "Delete File"
        },
        {
          "command": "codeswing.exportToCodePen",
          "title": "Export to CodePen",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.initializeWorkspace",
          "title": "Initialize Workspace as Swing",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.newSwingDirectory",
          "title": "New Swing in Directory...",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.newSwing",
          "title": "New Swing...",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.newSwingFromLastTemplate",
          "title": "New Swing from Last Template",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.openConsole",
          "title": "Open Console",
          "category": "CodeSwing",
          "icon": "$(terminal)"
        },
        {
          "command": "codeswing.openDeveloperTools",
          "title": "Open Dev Tools",
          "category": "CodeSwing",
          "icon": "$(tools)"
        },
        {
          "command": "codeswing.openSwing",
          "title": "Open Swing...",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.openSwingInNewWindow",
          "title": "Open Swing in New Window...",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.openWorkspaceSwing",
          "title": "Re-Open Workspace Swing",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.recordCodeTour",
          "title": "Record CodeTour"
        },
        {
          "command": "codeswing.renameSwingFile",
          "title": "Rename File"
        },
        {
          "command": "codeswing.run",
          "title": "Run Swing",
          "category": "CodeSwing",
          "icon": "$(play)"
        },
        {
          "command": "codeswing.saveCurrentSwing",
          "title": "Save Current Swing As...",
          "category": "CodeSwing"
        },
        {
          "command": "codeswing.uploadSwingFile",
          "title": "Upload File(s)",
          "icon": "$(cloud-upload)"
        }
      ],
      "views": {
        "explorer": [
          {
            "id": "codeswing.activeSwing",
            "name": "CodeSwing",
            "when": "codeswing:inSwing && !codeswing:inSwingWorkspace"
          }
        ]
      },
      "menus": {
        "commandPalette": [
          {
            "command": "codeswing.addLibrary",
            "when": "codeswing:inSwing"
          },
          {
            "command": "codeswing.changeLayout",
            "when": "codeswing:inSwing"
          },
          {
            "command": "codeswing.exportToCodePen",
            "when": "codeswing:inSwing"
          },
          {
            "command": "codeswing.initializeWorkspace",
            "when": "!codeswing:inSwingWorkspace && !codeswing:inSwing"
          },
          {
            "command": "codeswing.openConsole",
            "when": "codeswing:inSwing"
          },
          {
            "command": "codeswing.newSwingFromLastTemplate",
            "when": "codeswing:hasTemplateMRU"
          },
          {
            "command": "codeswing.openDeveloperTools",
            "when": "codeswing:inSwing && !isWeb"
          },
          {
            "command": "codeswing.openWorkspaceSwing",
            "when": "codeswing:inSwingWorkspace && !codeswing:inSwing"
          },
          {
            "command": "codeswing.run",
            "when": "codeswing:inSwing"
          },
          {
            "command": "codeswing.saveCurrentSwing",
            "when": "codeswing:inSwing"
          },
          {
            "command": "codeswing.addSwingFile",
            "when": "false"
          },
          {
            "command": "codeswing.deleteSwingFile",
            "when": "false"
          },
          {
            "command": "codeswing.recordCodeTour",
            "when": "false"
          },
          {
            "command": "codeswing.renameSwingFile",
            "when": "false"
          },
          {
            "command": "codeswing.uploadSwingFile",
            "when": "false"
          }
        ],
        "editor/title": [
          {
            "command": "codeswing.run",
            "when": "codeswing:inSwing",
            "group": "navigation@1"
          },
          {
            "command": "codeswing.openConsole",
            "when": "codeswing:inSwing",
            "group": "navigation@2"
          },
          {
            "command": "codeswing.changeLayout",
            "when": "codeswing:inSwing",
            "group": "navigation@3"
          },
          {
            "command": "codeswing.addLibrary",
            "when": "codeswing:inSwing",
            "group": "navigation@4"
          },
          {
            "command": "codeswing.openDeveloperTools",
            "when": "codeswing:inSwing && !isWeb",
            "group": "navigation@5"
          },
          {
            "command": "codeswing.recordCodeTour",
            "when": "codeswing:inSwing && codeswing:codeTourEnabled",
            "group": "codetour@1"
          }
        ],
        "view/title": [
          {
            "command": "codeswing.uploadSwingFile",
            "when": "view == codeswing.activeSwing",
            "group": "navigation@1"
          },
          {
            "command": "codeswing.addSwingFile",
            "when": "view == codeswing.activeSwing",
            "group": "navigation@2"
          }
        ],
        "view/item/context": [
          {
            "command": "codeswing.addSwingFile",
            "when": "viewItem == swing.directory",
            "group": "mutation@1"
          },
          {
            "command": "codeswing.uploadSwingFile",
            "when": "viewItem == swing.directory",
            "group": "mutation@2"
          },
          {
            "command": "codeswing.renameSwingFile",
            "when": "viewItem == swing.file",
            "group": "mutation@1"
          },
          {
            "command": "codeswing.deleteSwingFile",
            "when": "viewItem == swing.file",
            "group": "mutation@2"
          }
        ]
      },
      "jsonValidation": [
        {
          "fileMatch": "codeswing.json",
          "url": "https://gist.githubusercontent.com/lostintangent/21727eab0d79c7b9fd0dde92df7b1f50/raw/schema.json"
        },
        {
          "fileMatch": "gallery.json",
          "url": "https://gist.githubusercontent.com/lostintangent/091c0eec1f6443b526566d1cd3a85294/raw/schema.json"
        }
      ],
      "configuration": {
        "type": "object",
        "title": "CodeSwing",
        "properties": {
          "codeswing.autoRun": {
            "default": "onEdit",
            "enum": [
              "onEdit",
              "onSave",
              "never"
            ],
            "description": "Specifies when to automatically run the code for a swing."
          },
          "codeswing.autoSave": {
            "default": false,
            "type": "boolean",
            "description": "Specifies whether to automatically save your swing files (every 30s)."
          },
          "codeswing.clearConsoleOnRun": {
            "default": true,
            "type": "boolean",
            "description": "Specifies whether to automatically clear the console when running a swing."
          },
          "codeswing.launchBehavior": {
            "default": "openSwing",
            "enum": [
              "newSwing",
              "none",
              "openSwing"
            ],
            "description": "Specifies how CodeSwing should behave when you open a swing workspace."
          },
          "codeswing.layout": {
            "default": "splitLeft",
            "enum": [
              "grid",
              "preview",
              "splitBottom",
              "splitLeft",
              "splitLeftTabbed",
              "splitRight",
              "splitRightTabbed",
              "splitTop"
            ],
            "description": "Specifies how to layout the editor windows when opening a swing."
          },
          "codeswing.readmeBehavior": {
            "default": "none",
            "enum": [
              "none",
              "previewFooter",
              "previewHeader"
            ],
            "description": "Specifies how the swing's readme content should be displayed."
          },
          "codeswing.rootDirectory": {
            "default": null,
            "type": "string",
            "description": "Specifies the directory to create swings in within the open workspace."
          },
          "codeswing.showConsole": {
            "default": false,
            "type": "boolean",
            "description": "Specifies whether to automatically show the console when opening a swing."
          },
          "codeswing.templateGalleries": {
            "default": [
              "web:basic",
              "web:components",
              "web:languages"
            ],
            "type": "array",
            "items": {
              "anyOf": [
                {
                  "type": "string",
                  "enum": [
                    "web:basic",
                    "web:components",
                    "web:languages"
                  ]
                },
                {
                  "type": "string",
                  "format": "uri"
                }
              ]
            },
            "description": "Specifies one or more URLs that point of template galleries for creating swings."
          },
          "codeswing.themePreview": {
            "default": false,
            "type": "boolean",
            "description": "Specifies whether to apply Visual Studio Code theme to the preview window."
          }
        }
      },
      "languages": [
        {
          "id": "typescriptreact",
          "filenames": [
            "script.babel"
          ]
        },
        {
          "id": "yaml",
          "filenames": [
            ".block"
          ]
        }
      ],
      "keybindings": [
        {
          "command": "codeswing.run",
          "when": "codeswing:inSwing",
          "key": "cmd+shift+b",
          "win": "ctrl+shift+b"
        }
      ],
      "codeswing.templateGalleries": [
        {
          "id": "web:basic",
          "url": "https://cdn.jsdelivr.net/gh/codespaces-contrib/codeswing@HEAD/templates/basic.json"
        },
        {
          "id": "web:languages",
          "url": "https://cdn.jsdelivr.net/gh/codespaces-contrib/codeswing@HEAD/templates/languages.json"
        },
        {
          "id": "web:components",
          "url": "https://cdn.jsdelivr.net/gh/codespaces-contrib/codeswing@main/templates/components.json"
        }
      ]
    },
    "browser": "./dist/extension-web.js"
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [],
  "mode": "public"
}
