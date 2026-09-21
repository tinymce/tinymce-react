# Official TinyMCE React Component

## About

 Official React component for TinyMCE, the rich text editor. It makes integrating TinyMCE into React applications easy and seamless.

## Quickstart

### Cloud CDN

In your React project:

1. [Sign up for a Tiny Cloud account](https://www.tiny.cloud/pricing/) to receive a Tiny Cloud API key.
2. `npm install @tinymce/tinymce-react`
3. Include the following code:

```js
import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function App() {
  return (
    <>
      <h1>TinyMCE React demo</h1>
      <Editor
        apiKey="your-api-key"
        init={{
          plugins: 'lists link image table code help wordcount'
        }}
      />
    </>
  );
}
```

4. Update the `apiKey` prop on the `Editor` component to include your Tiny Cloud API key.

For more information: [Using TinyMCE with React - Cloud CDN](https://www.tiny.cloud/docs/tinymce/latest/react-cloud/)

### Self hosted via NPM package

Using TinyMCE from NPM in a React project requires a couple of extra steps. See the documentation for more information: [Using TinyMCE with React - Self hosted via NPM](https://www.tiny.cloud/docs/tinymce/latest/react-pm/)


## Demos

For our quick demos, check out the TinyMCE React [Storybook](https://tinymce.github.io/tinymce-react/).

## Detailed documentation

* [TinyMCE React Technical Reference](https://www.tiny.cloud/docs/tinymce/latest/react-ref/).
* [TinyMCE Documentation](https://www.tiny.cloud/docs/tinymce/latest/).


## Issues

Have you found an issue with `tinymce-react` or do you have a feature request?
Open up an [issue](https://github.com/tinymce/tinymce-react/issues) and let us know
or submit a [pull request](https://github.com/tinymce/tinymce-react/pulls).

_Note: for issues concerning TinyMCE please visit the [TinyMCE repository](https://github.com/tinymce/tinymce)._


## License

`tinymce-react` is licensed under the MIT License. See the LICENSE.txt file for details.

Depending on use case, the TinyMCE core editor can be used under either GPL-2.0-or-later or a commercial license. See the [tinymce package](https://www.npmjs.com/package/tinymce) for details.
