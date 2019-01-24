# Official TinyMCE React component

## About

This package is a thin wrapper around `tinymce` to make it easier to use in a React application. 

For some quick demos, check out the [storybook](https://tinymce.github.io/tinymce-react/).

## Installation
```sh
$ npm install @tinymce/tinymce-react
```

## Usage

### Importing the component

First you have to import the component, and how you do this depends on how the app you are developing is set up. 

```js
// es modules
import { Editor } from '@tinymce/tinymce-react';
// commonjs require
var { Editor } = require('@tinymce/tinymce-react');
```

### Using the component in your app

Use the editor in your app like this:

```js
<Editor
  apiKey="API_KEY"
  init={{ plugins: 'link table' }}
/>
```

### Configuring the editor

The editor accepts the following props:
* `disabled`: Using this prop that takes a boolean value you can dynamically set the editor into a "disabled" readonly mode or into the normal editable mode.
* `id`: An id for the editor so you can later grab the instance by using the `tinymce.get('ID')` method on tinymce, defaults to an automatically generated uuid. 
* `init`: Object sent to the `tinymce.init` method used to initialize the editor.
* `initialValue`: Initial value that the editor will be initialized with.
* `inline`: Shorthand for setting that the editor should be inline, `<Editor inline />` is the same as setting `{inline: true}` in the init.
* `tagName`: Only used if the editor is inline, decides what element to initialize the editor on, defaults to `div`.
* `plugins`: Shorthand for setting what plugins you want to use, `<Editor plugins="foo bar" />` is the same as setting `{plugins: 'foo bar'}` in the init.
* `toolbar`: Shorthand for setting what toolbar items you want to show, `<Editor toolbar="foo bar" />` is the same as setting `{toolbar: 'foo bar'}` in the init.
* `apiKey`: Api key for TinyMCE cloud, more info below.
* `cloudChannel`: Cloud channel for TinyMCE Cloud, more info below.
* `textareaName`: Sets the name attribute on the textarea that the editor is initialised on for use in forms.

None of the configuration props are **required** for the component to work - other than if you are using TinyMCE Cloud you will have to specify the `apiKey` to get rid of the `This domain is not registered...` warning message.

### Event binding

You can bind editor events via a shorthand prop on the editor, for example:

```js
<Editor onSelectionChange="this.handlerFunction" />
```

Where the handler function will be called with the event and a reference to the editor.

Here is a full list of the events available:
<details>
<summary>All available events</summary>

* `onActivate`
* `onAddUndo`
* `onBeforeAddUndo`
* `onBeforeExecCommand`
* `onBeforeGetContent`
* `onBeforeRenderUI`
* `onBeforeSetContent`
* `onBeforePaste`
* `onBlur`
* `onChange`
* `onClearUndos`
* `onClick`
* `onContextMenu`
* `onCopy`
* `onCut`
* `onDblclick`
* `onDeactivate`
* `onDirty`
* `onDrag`
* `onDragDrop`
* `onDragEnd`
* `onDragGesture`
* `onDragOver`
* `onDrop`
* `onExecCommand`
* `onFocus`
* `onFocusIn`
* `onFocusOut`
* `onGetContent`
* `onHide`
* `onInit`
* `onKeyDown`
* `onKeyPress`
* `onKeyUp`
* `onLoadContent`
* `onMouseDown`
* `onMouseEnter`
* `onMouseLeave`
* `onMouseMove`
* `onMouseOut`
* `onMouseOver`
* `onMouseUp`
* `onNodeChange`
* `onObjectResizeStart`
* `onObjectResized`
* `onObjectSelected`
* `onPaste`
* `onPostProcess`
* `onPostRender`
* `onPreProcess`
* `onProgressState`
* `onRedo`
* `onRemove`
* `onReset`
* `onSaveContent`
* `onSelectionChange`
* `onSetAttrib`
* `onSetContent`
* `onShow`
* `onSubmit`
* `onUndo`
* `onVisualAid`
</details>

## Using as a controlled component

If you want to use the component as a [controlled component](https://reactjs.org/docs/forms.html#controlled-components) you should use the `onEditorChange` instead of the `onChange` event, like this:

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = { content: '' };
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange(content) {
    this.setState({ content });
  }

  render() {
    return (
      <Editor value={this.state.content} onEditorChange={this.handleEditorChange} />
    )
  }
}
```

## Loading TinyMCE
### Auto-loading from TinyMCE Cloud
The `Editor` component needs TinyMCE to be globally available to work, but to make it as easy as possible it will automatically load [TinyMCE Cloud](https://www.tiny.cloud/docs/cloud-deployment-guide/) if it can't find TinyMCE available when the component is mounting. To get rid of the `This domain is not registered...` warning, sign up for the cloud and enter the api key like this:

```js
<Editor apiKey='YOUR_API_KEY' init={{ /* your other settings */ }} />
```

You can also define what cloud channel you want to use, with these three being the most commonly used:
* `stable` **Default**. The most stable and well tested version that has passed the Ephox quality assurance process.
* `testing` This channel will deploy the current candidate for release to the `stable` channel.
* `dev` The cutting edge version of TinyMCE updated daily for the daring users.

So using the `dev` channel would look like this:

```js
<Editor apiKey='YOUR_API_KEY' cloudChannel='dev' init={{ /* your other settings */ }} />
```

For more info on the different versions see the [documentation](https://www.tiny.cloud/docs/cloud-deployment-guide/editor-plugin-version/#devtestingandstablereleases).

### Loading TinyMCE by yourself

To opt out of using TinyMCE cloud you have to make TinyMCE globally available yourself. This can be done either by hosting the `tinymce.min.js` file by youself and adding a script tag to you HTML or, if you are using a module loader, installing TinyMCE with npm. For info on how to get TinyMCE working with module loaders check out [this page in the documentation](https://www.tinymce.com/docs/advanced/usage-with-module-loaders/).

## Documentation

Can be found on [TinyMCE.com](https://www.tinymce.com/docs/integrations/react/).
