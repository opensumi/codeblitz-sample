module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "worker-example",
    "version": "0.0.6"
  },
  "packageJSON": {
    "name": "worker-example",
    "version": "0.0.3",
    "publisher": "codeblitz",
    "engines": {
      "kaitian": "*"
    },
    "activationEvents": [
      "*"
    ],
    "enableKaitianWebAssets": true,
    "contributes": {
      "commands": [
        {
          "command": "test.registerMenu",
          "title": "测试注册菜单",
          "icon": "$(check)",
          "category": "Test"
        }
      ],
      "menus": {
        "editor/title": [
          {
            "command": "test.registerMenu",
            "group": "navigation"
          }
        ]
      }
    },
    "kaitianContributes": {
      "workerMain": "./worker.js",
      "browserMain": "./browser.js",
      "browserViews": {
        "left": {
          "type": "add",
          "view": [
            {
              "id": "Component",
              "icon": "extension"
            }
          ]
        }
      }
    }
  }
  ,
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [],
  "mode": "public"
}
