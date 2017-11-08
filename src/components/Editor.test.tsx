import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as TestUtils from 'react-dom/test-utils';
import { getGlobal } from '../TinyMCE';

import { Editor } from './Editor';

describe('tagName prop changes element', () => {
  it('it is div by default for inline', () => {
    const editor: any = TestUtils.renderIntoDocument(
      <Editor inline />
    );

    const editorNode = ReactDOM.findDOMNode(editor);

    expect(editorNode.tagName).toEqual('DIV');
  });

  it('it can be changed to p', () => {
    const editor: any = TestUtils.renderIntoDocument(
      <Editor inline tagName='p' />
    );

    const editorNode = ReactDOM.findDOMNode(editor);

    expect(editorNode.tagName).toEqual('P');
  });

  it('iframe editor does not change element', () => {
    const editor: any = TestUtils.renderIntoDocument(
      <Editor tagName='p' />
    );

    const editorNode = ReactDOM.findDOMNode(editor);

    expect(editorNode.tagName).toEqual('TEXTAREA');
  });
});

describe('id prop is set automatically if not set', () => {
  it('gets set normally if set', () => {
    const editor: any = TestUtils.renderIntoDocument(
      <Editor id='test' />
    );

    const editorNode = ReactDOM.findDOMNode(editor);

    expect(editorNode.id).toEqual('test');
  });

  it('gets set automatically to uuid if not set', () => {
    const editor: any = TestUtils.renderIntoDocument(
      <Editor />
    );

    const editorNode = ReactDOM.findDOMNode(editor);

    expect(editorNode.id).not.toBeFalsy();
  });
});
