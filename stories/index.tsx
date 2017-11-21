/* tslint:disable:no-console */
import { setDefaults, withInfo } from '@storybook/addon-info';
import { storiesOf } from '@storybook/react';
import * as React from 'react';
import { Editor } from '../src';
import { content } from './fakeContent';

setDefaults({
  inline: true,
  source: true,
  propTables: false
});

storiesOf('Editor', module)
  .add('Iframe editor', withInfo({
    text: 'Simple iframe editor with some initial html value. Logs editor content on change event.'
  })(() => (
    <Editor initialValue={content} onChange={(event, editor) => console.log(editor.getContent())}/>
  )))
  .add('Inline editor', withInfo({
    text: 'Simple inline editor with some initial html value. Logs editor content on change event.'
  })(() => (
    <Editor inline initialValue={content} onChange={(event, editor) => console.log(editor.getContent())}/>
  )))
  .add('Inlite editor', withInfo({
    text: 'Simple inline editor with some initial html value. Logs editor content on change event.'
  })(() => (
    <Editor
      inline
      init={{ theme: 'inlite' }}
      initialValue={content}
      onChange={(event, editor) => console.log(editor.getContent())}
    />
  )));
