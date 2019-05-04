import { Assertions, Chain, Logger, NamedChain, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import * as React from 'react';
import { cNamedChainDirect, cRemove, cSetup } from '../alien/Loader';
import { ApiChains } from '@ephox/mcagar';
import { getTinymce } from '../TinyMCE';
import { EventState } from '../alien/TestHelpers';

UnitTest.asynctest('Editor.test', (success, failure) => {
  const isEditor = (val: any) => {
    return val instanceof getTinymce().Editor;
  };

  const state = EventState();

  Pipeline.async({}, [
    Logger.t('Assert structure of editor and react wrapper events', Chain.asStep({}, [
      cSetup((Editor) => (
        <Editor
          onEditorChange={state.handler('onEditorChange')} // tinymce wrapped event
          onSetContent={state.handler('onSetContent')} // tinymce-react unique event
        />)
      ),
      NamedChain.asChain([
        cNamedChainDirect('editor'),
        NamedChain.read('editor', ApiChains.cSetContent('<p>New Content</p>')),

        state.cEach('onEditorChange', (args) => Assertions.assertEq('First arg should be new content', '<p>New Content</p>', args[0])),
        state.cEach('onEditorChange', (args) => Assertions.assertEq('Second arg should be editor', true, isEditor(args[1]))),

        state.cEach('onSetContent', (args) => Assertions.assertEq('First arg should be something', true, !!args[0])),
        state.cEach('onSetContent', (args) => Assertions.assertEq('Second arg should be editor', true, isEditor(args[1]))),
        NamedChain.outputInput
      ]),
      cRemove
    ]))
  ], success, failure);
});