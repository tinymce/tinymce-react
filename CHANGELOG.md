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