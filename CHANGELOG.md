# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [1.2.0](https://github.com/K-eL/vscode-vue-files/compare/v1.1.9...v1.2.0) (2025-11-30)

### Features

- add Pinia store generator with Setup and Options API styles
- add Composable generator with useState, useFetch, useEventListener, and custom patterns
- add configuration change listener to refresh settings dynamically
- enhance README with detailed documentation for all features

### Refactor

- extract logic from commands to dedicated services
- simplify and decouple components communication
- standardize file handling with base service abstraction
- rename "Vue File" to "Vue Component" for better clarity
- improve files and functions naming consistency

### Tests

- add comprehensive tests for Pinia store and Composable generators
- refactor and improve existing tests
- add compile steps for source code and tests in CI workflow
- update coverage configuration

### Bug Fixes

- correct normalization of component names in VueComponentService

## [1.1.9](https://github.com/K-eL/vscode-vue-files/compare/v1.1.8...v1.1.9) (2025-11-25)

### Features

- implement Quick Pick command for creating new Vue files with template selection

### Bug Fixes

- correct logic in generateBeforeMount to properly check script option

## [1.1.8](https://github.com/K-eL/vscode-vue-files/compare/v1.1.7...v1.1.8) (2025-11-23)

### Bug Fixes

- run vsce publish in xvfb to ensure compatibility with headless environments ([4d6e558](https://github.com/K-eL/vscode-vue-files/commit/4d6e558a9afb1e78b04a72348b5f79ec8175b8d6))

## [1.1.7](https://github.com/K-eL/vscode-vue-files/compare/v1.1.6...v1.1.7) (2025-11-23)

### Bug Fixes

- update .vscodeignore and remove unnecessary files from package.json ([71bfa0c](https://github.com/K-eL/vscode-vue-files/commit/71bfa0caf7048fe6dd6b4f2a062c8d5a7e51b2a0))

## [1.1.6](https://github.com/K-eL/vscode-vue-files/compare/v1.1.5...v1.1.6) (2025-11-23)

### Bug Fixes

- run vsce package in xvfb to ensure compatibility with headless environments ([4533acf](https://github.com/K-eL/vscode-vue-files/commit/4533acffd33283e5049d71eaaeb7302641c9667c))

## [1.1.5](https://github.com/K-eL/vscode-vue-files/compare/v1.1.4...v1.1.5) (2025-11-23)

### Bug Fixes

- run tests in xvfb for headless environment; clean up husky scripts ([1c1001c](https://github.com/K-eL/vscode-vue-files/commit/1c1001c12fab5080cff84d9fc5dd592f85f4402e))

## [1.1.4](https://github.com/K-eL/vscode-vue-files/compare/v1.1.2...v1.1.4) (2025-11-23)

### Features

- add automations to release, versioning and changelog
- add release scripts for versioning and tagging
- introduce commitlint and husky for commit message validation
- create GitHub Actions workflow for publishing the extension
- add pre-commit hook for linting
- add commit message hook for linting
- create versioning configuration for changelog generation

### Bug Fixes

- fix npm deps vulnerabilities

## [1.1.2](https://github.com/K-eL/vscode-vue-files/compare/v1.1.1...v1.1.2) (2024-08-04)

### Bug Fixes

- fix typo

## [1.1.1](https://github.com/K-eL/vscode-vue-files/compare/v1.1.0...v1.1.1) (2024-08-04)

### Features

- check the user's 'tabSize' and 'insertSpaces' settings values to generate the file content with the appropriate indentation
- add tests
- upgrade dependencies
- update coding styles
- update README.md and CHANGELOG.md files

## [1.1.0](https://github.com/K-eL/vscode-vue-files/compare/v1.0.0...v1.1.0) (2023-04-17)

### Features

- improve code quality
- include more customization options in extension settings
- add an improved menu and better description for the settings
- remove previous settings
- include more general settings to show the menu options
- include the base template of a working V-Model for new components (can be disabled on settings)
- improve how component name is generated based on the given string

## [1.0.0](https://github.com/K-eL/vscode-vue-files/commit/41409e711edde150dc04d7d2ccdb038bcc5e6d46) Initial Release (2023-04-10)

### Features

- make users able to choose between Options API and Composition API
- make users able to choose between Javascript or Typescript as script language
- make users able to choose between Css or Scss as style language
