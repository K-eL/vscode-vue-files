# VSCode Vue Files

This extension allows you to quickly create new Vue files filled with some boilerplate content depending on your choice.

> Inspired by Angular Files (https://github.com/ivalexa/vscode-angular2-files)

## Features

Right-click inside your explorer panel or over a folder to open "Vue Files" menu option. 

You will find many options to choose how you want to create your new file.

---

> 1- Right-click on a folder and choose the template you want

![features](./assets/demo_001.png)

---

> 2- Choose the name of your file (extension not needed)

![features](./assets/demo_002.png)

---

> 3- Enjoy your easily created Vue Component file

![features](./assets/demo_003.png)

## Extension Settings

You can add these options to your VS Code Settings to have a better experience:

**File config**

If true, places the `script` tag at the top of the new files, otherwise, the `template` tag comes at the top. It's **false** by default (`template` first).
```
"vscode-vue-files.template.script-comes-first": false
```

**Menu config**

These configs enables/disables the respective menu options, all enabled by default:
```
"vscode-vue-files.menu.show-setup-ts-scss": true,
"vscode-vue-files.menu.show-setup-ts-css": true,
"vscode-vue-files.menu.show-setup-js-scss": true,
"vscode-vue-files.menu.show-setup-js-css": true,
"vscode-vue-files.menu.show-options-ts-scss": true,
"vscode-vue-files.menu.show-options-ts-css": true,
"vscode-vue-files.menu.show-options-js-scss": true,
"vscode-vue-files.menu.show-options-js-css": true
```

## Release Notes
### 1.0.0

* Initial release.
* Users can choose between Options API and Composition API.
* Users can choose Javascript or Typescript as script language.
* Users can choose Css or Scss as style language.

## Disclaimer

>**Important:** This extension due to the nature of it's purpose will create
files on your hard drive and if necessary create the respective folder structure.
While it should not override any files during this process, I'm not giving any guarantees
or take any responsibility in case of lost data. 

## License

MIT

**Enjoy!**
