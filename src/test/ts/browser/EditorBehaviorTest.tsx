import { Assertions, Chain, Logger, Pipeline } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock';
import { cRemove, cRender, cEditor, cReRender } from '../alien/Loader';
import { ApiChains } from '@ephox/mcagar';
import { getTinymce } from '../../../main/ts/TinyMCE';
import { EventStore } from '../alien/TestHelpers';

UnitTest.asynctest('Editor.test', (success, failure) => {
  const isEditor = (val: any) => {
    return val instanceof getTinymce().Editor;
  };

  const eventStore = EventStore();

  Pipeline.async({}, [
    Logger.t('Assert structure of tinymce and tinymce-react events', Chain.asStep({}, [
      cRender({
        onEditorChange: eventStore.createHandler('onEditorChange'),
        onSetContent: eventStore.createHandler('onSetContent')
      }),

      cEditor(ApiChains.cSetContent('<p>Initial Content</p>')),

      // tinymce native event
      eventStore.cEach('onSetContent', (integrationEvents) => {
        Assertions.assertEq('First arg should be event from Tiny', '<p>Initial Content</p>', integrationEvents[0].editorEvent.content);
        Assertions.assertEq('Second arg should be editor', true, isEditor(integrationEvents[0].editor));
      }),

      // tinymce-react unique event
      eventStore.cEach('onEditorChange', (integrationEvents) => {
        Assertions.assertEq('First arg should be new content', '<p>Initial Content</p>', integrationEvents[0].editorEvent);
        Assertions.assertEq('Second arg should be editor', true, isEditor(integrationEvents[0].editor));
      }),

      eventStore.cClearState,
      cRemove
    ])),

    Logger.t('onEditorChange should only fire when the editors content changes', Chain.asStep({}, [
      cRender({
        onEditorChange: eventStore.createHandler('onEditorChange')
      }),

      cEditor(ApiChains.cSetContent('<p>Initial Content</p>')),
      cEditor(ApiChains.cSetContent('<p>Initial Content</p>')), // Repeat

      eventStore.cEach('onEditorChange', (integrationEvents) => {
        Assertions.assertEq('onEditorChange should have been fired once', 1, integrationEvents.length);
      }),

      eventStore.cClearState,
      cRemove
    ])),

    Logger.t('Should be able to register an event handler after initial render', Chain.asStep({}, [
      cRender({ initialValue: '<p>Initial Content</p>' }),
      cReRender({ onSetContent: eventStore.createHandler('onSetContent') }),

      cEditor(ApiChains.cAssertContent('<p>Initial Content</p>')),
      cEditor(ApiChains.cSetContent('<p>New Content</p>')),

      eventStore.cEach('onSetContent', (integrationEvents) => {
        Assertions.assertEq('Should have bound handler, hence new content', '<p>New Content</p>', integrationEvents[0].editorEvent.content);
      }),

      eventStore.cClearState,
      cRemove
    ])),

    Logger.t('Providing a new event handler and re-rendering should unbind old handler and bind new handler', Chain.asStep({}, [
      cRender({ onSetContent: eventStore.createHandler('InitialHandler') }),
      cEditor(ApiChains.cSetContent('<p>Initial Content</p>')),

      cReRender({ onSetContent: eventStore.createHandler('NewHandler') }),
      cEditor(ApiChains.cSetContent('<p>New Content</p>')),

      eventStore.cEach('InitialHandler', (integrationEvents) => {
        Assertions.assertEq('Initial handler should have been unbound, hence initial content', '<p>Initial Content</p>', integrationEvents[0].editorEvent.content);
      }),
      eventStore.cEach('NewHandler', (integrationEvents) => {
        Assertions.assertEq('New handler should have been bound, hence new content', '<p>New Content</p>', integrationEvents[0].editorEvent.content);
      }),

      eventStore.cClearState,
      cRemove
    ]))
  ], success, failure);
});