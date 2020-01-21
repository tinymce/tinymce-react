import { Assertions, Chain, Logger, Pipeline, GeneralSteps } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { cRemove, cRender, cEditor, cReRender } from '../alien/Loader';
import { ApiChains } from '@ephox/mcagar';
import { VersionLoader } from '@tinymce/miniature';

import { getTinymce } from '../../../main/ts/TinyMCE';
import { EventStore } from '../alien/TestHelpers';

UnitTest.asynctest('EditorBehaviorTest', (success, failure) => {
  const isEditor = (val: any) => {
    return val instanceof getTinymce().Editor;
  };

  const eventStore = EventStore();

  const sTestVersion = (version: '4' | '5') => VersionLoader.sWithVersion(
    version,
    GeneralSteps.sequence([
      Logger.t('Assert structure of tinymce and tinymce-react events', Chain.asStep({}, [
        cRender({
          onEditorChange: eventStore.createHandler('onEditorChange'),
          onSetContent: eventStore.createHandler('onSetContent')
        }),

        cEditor(ApiChains.cSetContent('<p>Initial Content</p>')),

        // tinymce native event
        eventStore.cEach('onSetContent', (events) => {
          Assertions.assertEq('First arg should be event from Tiny', '<p>Initial Content</p>', events[0].editorEvent.content);
          Assertions.assertEq('Second arg should be editor', true, isEditor(events[0].editor));
        }),

        // tinymce-react unique event
        eventStore.cEach('onEditorChange', (events) => {
          Assertions.assertEq('First arg should be new content', '<p>Initial Content</p>', events[0].editorEvent);
          Assertions.assertEq('Second arg should be editor', true, isEditor(events[0].editor));
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

        eventStore.cEach('onEditorChange', (events) => {
          Assertions.assertEq('onEditorChange should have been fired once', 1, events.length);
        }),

        eventStore.cClearState,
        cRemove
      ])),

      Logger.t('Should be able to register an event handler after initial render', Chain.asStep({}, [
        cRender({ initialValue: '<p>Initial Content</p>' }),
        cReRender({ onSetContent: eventStore.createHandler('onSetContent') }),

        cEditor(ApiChains.cAssertContent('<p>Initial Content</p>')),
        cEditor(ApiChains.cSetContent('<p>New Content</p>')),

        eventStore.cEach('onSetContent', (events) => {
          Assertions.assertEq('Should have bound handler, hence new content', '<p>New Content</p>', events[0].editorEvent.content);
        }),

        eventStore.cClearState,
        cRemove
      ])),

      Logger.t('Providing a new event handler and re-rendering should unbind old handler and bind new handler', Chain.asStep({}, [
        cRender({ onSetContent: eventStore.createHandler('InitialHandler') }),
        cEditor(ApiChains.cSetContent('<p>Initial Content</p>')),

        cReRender({ onSetContent: eventStore.createHandler('NewHandler') }),
        cEditor(ApiChains.cSetContent('<p>New Content</p>')),

        eventStore.cEach('InitialHandler', (events) => {
          Assertions.assertEq('Initial handler should have been unbound, hence initial content', '<p>Initial Content</p>', events[0].editorEvent.content);
        }),
        eventStore.cEach('NewHandler', (events) => {
          Assertions.assertEq('New handler should have been bound, hence new content', '<p>New Content</p>', events[0].editorEvent.content);
        }),

        eventStore.cClearState,
        cRemove
      ])),

      Logger.t('"format" prop should set the format of the content emitted by onEditorChange', Chain.asStep({}, [
        cRender({
          outputFormat: 'text',
          onEditorChange: eventStore.createHandler('onEditorChange')
        }),

        Chain.op((context) => {
          context.editor.setContent('<p>Test #1</p>');
        }),

        eventStore.cEach('onEditorChange', (events) => {
          Assertions.assertEq('Content emitted should be format: "text"', 'Test #1', events[0].editorEvent);
        }),

        cReRender({
          outputFormat: 'html',
          onEditorChange: eventStore.createHandler('onEditorChange2')
        }),

        Chain.op((context) => {
          context.editor.setContent('<p>Test #2</p>');
        }),

        eventStore.cEach('onEditorChange2', (events) => {
          Assertions.assertEq('Content emitted should be format: "html"', '<p>Test #2</p>', events[0].editorEvent);
        }),

        eventStore.cClearState,
        cRemove
      ])),
    ])
  );

  Pipeline.async({}, [
    sTestVersion('5'),
    sTestVersion('4')
  ], success, failure);
});