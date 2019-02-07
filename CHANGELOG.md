## 2.6.1 (2019-02-07)
* Changed `react` and `react-dom` to be peerDependencies and devDependencies.

## 2.6.0 (2019-02-07)
* Changed `react` and `react-dom` to be peerDependencies.

## 2.5.0 (2019-01-24)
* Loosened cloudChannel proptype to take any string to be able to use the locked version channels.

## 2.4.0 (2018-11-02)
* Added `textareaName` prop that sets the name attribute on the textarea for use in forms.

## 2.3.0 (2018-10-01)
* Added `disabled` prop that sets the editor into readonly mode.

## 2.2.6 (2018-09-03)
* Fixed broken links in readme.

## 2.2.5 (2018-04-23)
* Added a nullcheck in componentWillUnmount to check that tinymce is availabl before running remove.

## 2.2.4 (2018-04-06)
* Removed onPreInit shorthand as it never worked.

## 2.2.3 (2018-04-06)
* Fixed a bug with onInit not working.

## 2.2.2 (2018-04-05)
* Fixed a bug with values set while the editor was initializing.

## 2.2.1 (2018-04-03)
* No change, pushed to fix missing readme on npm.

## 2.2.0 (2018-02-19)
* Added functionality so you can use the editor as a controlled component by setting the `value` property and using the `onEditorChange` event.

## 2.1.4 (2018-02-16)
* Fixed bug where is wasn't possible to set inline in the init object, only on the shorthand.

## 2.1.3 (2018-01-17)
* Added `plugins` and `toolbar` shorthands.

## 2.1.2 (2018-01-08)
* Use `target` on element instead of `selector` in init config.

## 2.1.1 (2018-01-03)
* Fix so init setup callback gets called like it should.

## 2.1.0 (2017-12-18)
* Added auto-loading of TinyMCE from TinyMCE Cloud

## 2.0.3 (2017-11-22)
* Added check for `initialValue` prop to prevent javascript error that was shown when `tinymce.setContent` was called with undefined.

## 2.0.2 (2017-11-22)
* Accidentally published 2.0.1 without building first, published this version to fix that and added prepare hook to prevent the same thing from happening again.

## 2.0.1 (2017-11-21)
* Added description to package.json and improved readme wording.

## 2.0.0 (2017-11-08)
* *BREAKING!* Switched `value` prop to `initialValue` to make it clearer what it actually does. 
* Only bind whitelisted events.
* Add support for `tagName` prop when using editor inline to define what element you want to initialize the editor on.

## 1.0.0 (2017-11-07)
* Initial Release.