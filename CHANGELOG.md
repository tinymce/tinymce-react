# Change log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.10.2] - 2021-02-20
## Fixed
- Event handlers are registered at setup time so props like `onBeforeRenderUI` will now be called. #INT-2325

## [3.10.1] - 2021-02-01
### Fixed
- Fixed CI build

## [3.10.0] - 2021-02-01
### Fixed
- Fixed event binding to lookup handlers at call time instead of rebinding on every change.

## [3.9.0] - 2021-01-11
### Changed
- Adopted beehive-flow branching and versioning process/tooling.
- Changed the changelog formatting
- Updated dependencies to latest available

## [3.8.4] - 2020-12-16
### Fixed
- Updated dependencies to latest available

## [3.8.3] - 2020-12-08
### Changed
- Updated TinyMCE types to 5.6 release.

### Fixed
- Fixed event binding to only rebind handler on changes to the specific property instead of any property.

## [3.8.2] - 2020-12-03
### Fixed
- Fixed external changes not generating undo levels

## [3.8.1] - 2020-10-22
### Fixed
- Fixed an issue where the component would throw an error when unmounted while loading

## [3.8.0] - 2020-10-08
### Added
- Added types from TinyMCE 5.5 release.

## [3.7.0] - 2020-09-28
### Added
- Added `scriptLoading` prop with settings `async`, `defer` and `delay` to modify the loading behaviour of the TinyMCE script tag

## [3.6.1] - 2020-09-07
### Fixed
- Upgraded dependencies to latest available.

## [3.6.0] - 2020-05-07
### Fixed
- Fixed an issue that allowed events to be fired during `componentWillUnmount`

## [3.5.1] - 2020-04-30
### Fixed
- Remove `util` module from dependencies by purging usage in code.
- Upgraded jquery in dev dependencies in response to security alert.

## [3.5.0] - 2020-02-24
### Added
- Added new `tinymceScriptSrc` prop for specifying an external version of TinyMCE to lazy load

## [3.4.0] - 2020-01-31
### Added
- Added new `outputFormat` prop for specifying the format of the content emitted via the `onEditorChange` event

## [3.3.2] - 2019-08-29
### Fixed
- Fixed an issue that caused `onEditorChange` to fire multiple times

## [3.3.1] - 2019-08-16
### Fixed
- Changed referrer policy to origin to allow cloud caching

## [3.3.0] - 2019-07-29
### Fixed
- Fixed an issue that made the editor ignore new event handlers provided through props
- Removed use of deprecated lifecycle hooks `componentWillMount` and `componentWillReceiveProps`

## [3.2.0] - 2019-06-04
### Fixed
- Changed the CDN URL to use `cdn.tiny.cloud`

## [3.1.1] - 2019-05-10
### Changed
- Removed preinstall script

## [3.1.0] - 2019-05-10
### Changed
- Added the editor as a second argument to `onEditorChange`
- Exported Typescript prop types

## [3.0.1] - 2019-02-11
### Changed
- Updated readme on cloud channels.

## [3.0.0] - 2019-02-11
### Changed
- Changed default cloudChannel to `'5'`.

## [2.6.1] - 2019-02-07
### Fixed
- Changed `react` and `react-dom` to be peerDependencies and devDependencies.

## [2.6.0] - 2019-02-07
### Fixed
- Changed `react` and `react-dom` to be peerDependencies.

## [2.5.0] - 2019-01-24
### Changed
- Loosened cloudChannel proptype to take any string to be able to use the locked version channels.

## [2.4.0] - 2018-11-02
### Added
- Added `textareaName` prop that sets the name attribute on the textarea for use in forms.

## [2.3.0] - 2018-10-01
### Added
- Added `disabled` prop that sets the editor into readonly mode.

## [2.2.6] - 2018-09-03
### Fixed
- Fixed broken links in readme.

## [2.2.5] - 2018-04-23
### Fixed
- Added a nullcheck in componentWillUnmount to check that tinymce is available before running remove.

## [2.2.4] - 2018-04-06
### Fixed
- Removed onPreInit shorthand as it never worked.

## [2.2.3] - 2018-04-06
### Fixed
- Fixed a bug with onInit not working.

## [2.2.2] - 2018-04-05
### Fixed
- Fixed a bug with values set while the editor was initializing.

## [2.2.1] - 2018-04-03
### Fixed
- No change, pushed to fix missing readme on npm.

## [2.2.0] - 2018-02-19
### Added
- Added functionality so you can use the editor as a controlled component by setting the `value` property and using the `onEditorChange` event.

## [2.1.4] - 2018-02-16
### Fixed
- Fixed bug where is wasn't possible to set inline in the init object, only on the shorthand.

## [2.1.3] - 2018-01-17
### Added
- Added `plugins` and `toolbar` shorthands.

## [2.1.2] - 2018-01-08
### Changed
- Use `target` on element instead of `selector` in init config.

## [2.1.1] - 2018-01-03
### Added
- Fix so init setup callback gets called like it should.

## [2.1.0] - 2017-12-18
### Added
- Added auto-loading of TinyMCE from TinyMCE Cloud

## [2.0.3] - 2017-11-22
### Fixed
- Added check for `initialValue` prop to prevent javascript error that was shown when `tinymce.setContent` was called with undefined.

## [2.0.2] - 2017-11-22
### Fixed
- Accidentally published 2.0.1 without building first, published this version to fix that and added prepare hook to prevent the same thing from happening again.

## [2.0.1] - 2017-11-21
### Added
- Added description to package.json and improved readme wording.

## [2.0.0] - 2017-11-08
### Added
- Add support for `tagName` prop when using editor inline to define what element you want to initialize the editor on.
### Changed
- *BREAKING!* Switched `value` prop to `initialValue` to make it clearer what it actually does. 
### Fixed
- Only bind whitelisted events.

## [1.0.0] - 2017-11-07
### Added
- Initial Release.
