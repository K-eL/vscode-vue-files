# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.1.7](https://github.com/K-eL/vscode-vue-files/compare/v1.1.6...v1.1.7) (2025-11-23)


### Bug Fixes

* update .vscodeignore and remove unnecessary files from package.json ([71bfa0c](https://github.com/K-eL/vscode-vue-files/commit/71bfa0caf7048fe6dd6b4f2a062c8d5a7e51b2a0))

## [1.1.6](https://github.com/K-eL/vscode-vue-files/compare/v1.1.5...v1.1.6) (2025-11-23)


### Bug Fixes

* run vsce package in xvfb to ensure compatibility with headless environments ([4533acf](https://github.com/K-eL/vscode-vue-files/commit/4533acffd33283e5049d71eaaeb7302641c9667c))

## [1.1.5](https://github.com/K-eL/vscode-vue-files/compare/v1.1.4...v1.1.5) (2025-11-23)


### Bug Fixes

* run tests in xvfb for headless environment; clean up husky scripts ([1c1001c](https://github.com/K-eL/vscode-vue-files/commit/1c1001c12fab5080cff84d9fc5dd592f85f4402e))

## [1.1.4](https://github.com/K-eL/vscode-vue-files/compare/v1.1.2...v1.1.4) (2025-11-23)

## [1.1.3]

- Fixed npm deps vulnerabilities.

## [1.1.2]

- Fixed a typo.

## [1.1.1]

- The extension now checks the user's 'tabSize' and 'insertSpaces' settings values to generate the file content with the appropriate indentation.
- Added tests. (Still in progress)
- Upgraded dependencies.
- Updated coding styles.
- Updated README.md and CHANGELOG.md files.

## [1.1.0]

- Many code quality improvements.
- Included many other options that can be enabled/disabled through settings.
- Added a fancy menu and better description for the settings.
- Previous settings were removed, now more general settings were included to show the menu options.
- Included the base template of a working V-Model for new components (can be disabled on settings).
- Improved how component name is generated based on the given string.

## [1.0.0] - Initial Release

- Users can choose between Options API and Composition API.
- Users can choose Javascript or Typescript as script language.
- Users can choose Css or Scss as style language.
