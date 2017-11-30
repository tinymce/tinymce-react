# Official TinyMCE React component

## About

This package is a thin wrapper around `tinymce` to make it easier to use in a React application. 

For some quick demos, check out the [storybook](https://tinymce.github.io/tinymce-react/).

## Installation
```sh
$ npm install @tinymce/tinymce-react
```
## Loading TinyMCE
### Auto-loading from TinyMCE Cloud
The `Editor` component needs TinyMCE to be globally available to work, but to make it as easy as possible it will automatically load [TinyMCE Cloud](https://www.tinymce.com/docs/get-started-cloud/) if it can't find TinyMCE available when the component is mounting. To get rid of the `This domain is not registered...` warning, sign up for the cloud and enter the api key like this:

```js
<Editor apiKey='YOUR_API_KEY' init={{ /* your other settings */ }} />
```

You can also define what cloud channel you want to use out these three
* `stable` **Default**. The most stable and well tested version that has passed the Ephox quality assurance process.
* `testing` This channel will deploy the current candidate for release to the `stable` channel.
* `dev` The cutting edge version of TinyMCE updated daily for the daring users.

So using the `dev` channel would look like this:

```js
<Editor apiKey='YOUR_API_KEY' cloudChannel='dev' init={{ /* your other settings */ }} />
```

For more info on the different versions see the [documentation](https://www.tinymce.com/docs/get-started-cloud/editor-plugin-version/#devtestingandstablereleases).

### Loading TinyMCE by yourself

To opt out of using TinyMCE cloud you have to make TinyMCE globally available yourself. This can be done either by hosting the `tinymce.min.js` file by youself and adding a script tag to you HTML or, if you are using a module loader, installing TinyMCE with npm. For info on how to get TinyMCE working with module loaders check out [this page in the documentation](https://www.tinymce.com/docs/advanced/usage-with-module-loaders/).

## Documentation

Can be found on [TinyMCE.com](https://www.tinymce.com/docs/integrations/react/).
