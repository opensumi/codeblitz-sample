module.exports = {
  "extension": {
    "publisher": "codeblitz",
    "name": "collaboration",
    "version": "0.0.2"
  },
  "packageJSON": {
    "publisher": "codeblitz",
    "name": "collaboration",
    "version": "0.0.2",
    "activationEvents": [
      "*"
    ],
    "kaitianContributes": {
      "workerMain": "./out/extension.js"
    },
    "contributes": {
      "configuration": {
        "title": "collaboration",
        "properties": {
          "collaboration.debug": {
            "type": "boolean",
            "scope": "window",
            "description": "debug mode",
            "default": false
          },
          "collaboration.locale": {
            "type": "string",
            "scope": "window",
            "description": "locale",
            "default": "zh-CN"
          }
        }
      },
      "workerMain": "./out/extension.js"
    }
  },
  "pkgNlsJSON": {},
  "nlsList": [],
  "extendConfig": {},
  "webAssets": [],
  "mode": "public"
}
