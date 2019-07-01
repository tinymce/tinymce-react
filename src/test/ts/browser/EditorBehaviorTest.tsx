import { Assertions, Chain, Logger, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { cRemove, cRender, cEditor, cReRender } from '../alien/Loader';
import { ApiChains } from '@ephox/mcagar';
import { getTinymce } from '../../../main/ts/TinyMCE';
import { EventState } from '../alien/TestHelpers';

UnitTest.asynctest('Editor.test', (success, failure) => {
  const isEditor = (val: any) => {
    return val instanceof getTinymce().Editor;
  };

  const eventState = EventState();

  Pipeline.async({}, [
    Logger.t('Assert structure of tinymce and tinymce-react events', Chain.asStep({}, [
      cRender({
        onEditorChange: eventState.createHandler('onEditorChange'),
        onSetContent: eventState.createHandler('onSetContent')
      }),

      cEditor(ApiChains.cSetContent('<p>Initial Content</p>')),

      // tinymce native event
      eventState.cEach('onSetContent', (args) => Assertions.assertEq('First arg should be event from Tiny', '<p>Initial Content</p>', args[0].content)),
      eventState.cEach('onSetContent', (args) => Assertions.assertEq('Second arg should be editor', true, isEditor(args[1]))),

      // tinymce-react unique event
      eventState.cEach('onEditorChange', (args) => Assertions.assertEq('First arg should be new content', '<p>Initial Content</p>', args[0])),
      eventState.cEach('onEditorChange', (args) => Assertions.assertEq('Second arg should be editor', true, isEditor(args[1]))),

      eventState.cClearState,
      cRemove
    ])),

    Logger.t('Should be able to register an event handler after initial render', Chain.asStep({}, [
      cRender({ initialValue: '<p>Initial Content</p>' }),
      cReRender({ onSetContent: eventState.createHandler('onSetContent') }),

      cEditor(ApiChains.cAssertContent('<p>Initial Content</p>')),
      cEditor(ApiChains.cSetContent('<p>New Content</p>')),

      eventState.cEach('onSetContent', (args) =>  Assertions.assertEq('Should have bound handler, hence new content', '<p>New Content</p>', args[0].content)),

      eventState.cClearState,
      cRemove
    ])),

    Logger.t('Providing a new event handler and re-rendering should unbind old handler and bind new handler', Chain.asStep({}, [
      cRender({ onSetContent: eventState.createHandler('InitialHandler') }),
      cEditor(ApiChains.cSetContent('<p>Initial Content</p>')),

      cReRender({ onSetContent: eventState.createHandler('NewHandler') }),
      cEditor(ApiChains.cSetContent('<p>New Content</p>')),

      eventState.cEach('InitialHandler', (args) => {
        return Assertions.assertEq('Initial handler should have been unbound, hence initial content', '<p>Initial Content</p>', args[0].content);
      }),
      eventState.cEach('NewHandler', (args) => {
        return Assertions.assertEq('New handler should have been bound, hence new content', '<p>New Content</p>', args[0].content);
      }),

      eventState.cClearState,
      cRemove
    ]))
  ], success, failure);
});