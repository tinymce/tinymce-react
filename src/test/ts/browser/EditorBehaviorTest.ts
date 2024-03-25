import { Assertions, Chain, Logger, Pipeline, GeneralSteps } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { cRemove, cRender, cEditor, cReRender } from '../alien/Loader';
import { VersionLoader } from '@tinymce/miniature';
import { PlatformDetection } from '@ephox/sand';

import { getTinymce } from '../../../main/ts/TinyMCE';
import { EventStore, VERSIONS, cAssertContent, cSetContent, type Version } from '../alien/TestHelpers';
import { Editor as TinyMCEEditor, EditorEvent, Events } from 'tinymce';

type SetContentEvent = EditorEvent<Events.EditorEventMap['SetContent']>;

UnitTest.asynctest('EditorBehaviorTest', (success, failure) => {
  const browser = PlatformDetection.detect().browser;
  if (browser.isIE()) {
    // INT-2278: This test currently times out in IE so we are skipping it
    success();
    return;
  }
  const versionRegex = /6|7/;

  const isEditor = (val: unknown): val is TinyMCEEditor => {
    const tinymce = getTinymce(window);
    if (!tinymce) {
      return false;
    }
    return val instanceof tinymce.Editor;
  };

  const eventStore = EventStore();

  const sTestVersion = (version: Version) => VersionLoader.sWithVersion(
    version,
    GeneralSteps.sequence([
      Logger.t('Assert structure of tinymce and tinymce-react events', Chain.asStep({}, [
        cRender({
          onEditorChange: eventStore.createHandler('onEditorChange'),
          onSetContent: eventStore.createHandler('onSetContent')
        }),

        // tinymce native event
        // initial content is empty as editor does not have a value or initialValue
        eventStore.cEach<SetContentEvent>('onSetContent', (events) => {
          // note that this difference in behavior in 5-6 may be a bug, the team is investigating
          Assertions.assertEq(
            'First arg should be event from Tiny',
            versionRegex.test(version) ? '<p><br data-mce-bogus="1"></p>' : '',
            events[0].editorEvent.content
          );
          Assertions.assertEq('Second arg should be editor', true, isEditor(events[0].editor));
        }),

        eventStore.cClearState,

        cEditor(cSetContent('<p>Initial Content</p>')),

        // tinymce native event
        eventStore.cEach<SetContentEvent>('onSetContent', (events) => {
          Assertions.assertEq('onSetContent should have been fired once', 1, events.length);
          Assertions.assertEq('First arg should be event from Tiny', '<p>Initial Content</p>', events[0].editorEvent.content);
          Assertions.assertEq('Second arg should be editor', true, isEditor(events[0].editor));
        }),

        // tinymce-react unique event
        eventStore.cEach<string>('onEditorChange', (events) => {
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

        cEditor(cSetContent('<p>Initial Content</p>')),
        cEditor(cSetContent('<p>Initial Content</p>')), // Repeat

        eventStore.cEach('onEditorChange', (events) => {
          Assertions.assertEq('onEditorChange should have been fired once', 1, events.length);
        }),

        eventStore.cClearState,
        cRemove
      ])),

      Logger.t('Should be able to register an event handler after initial render', Chain.asStep({}, [
        cRender({ initialValue: '<p>Initial Content</p>' }),
        cReRender({ onSetContent: eventStore.createHandler('onSetContent') }),

        cEditor(cAssertContent('<p>Initial Content</p>')),
        cEditor(cSetContent('<p>New Content</p>')),

        eventStore.cEach<SetContentEvent>('onSetContent', (events) => {
          Assertions.assertEq('Should have bound handler, hence new content', '<p>New Content</p>', events[0].editorEvent.content);
        }),

        eventStore.cClearState,
        cRemove
      ])),

      Logger.t('Providing a new event handler and re-rendering should unbind old handler and bind new handler', Chain.asStep({}, [
        cRender({ onSetContent: eventStore.createHandler('InitialHandler') }),
        eventStore.cEach<SetContentEvent>('InitialHandler', (events) => {
          Assertions.assertEq(
            'Initial content is empty as editor does not have a value or initialValue',
            // note that this difference in behavior in 5-6 may be a bug, the team is investigating
            versionRegex.test(version) ? '<p><br data-mce-bogus="1"></p>' : '',
            events[0].editorEvent.content);
        }),
        eventStore.cClearState,
        cEditor(cSetContent('<p>Initial Content</p>')),

        cReRender({ onSetContent: eventStore.createHandler('NewHandler') }),
        cEditor(cSetContent('<p>New Content</p>')),

        eventStore.cEach<SetContentEvent>('InitialHandler', (events) => {
          Assertions.assertEq('Initial handler should have been unbound, hence initial content', '<p>Initial Content</p>', events[0].editorEvent.content);
        }),
        eventStore.cEach<SetContentEvent>('NewHandler', (events) => {
          Assertions.assertEq('New handler should have been bound, hence new content', '<p>New Content</p>', events[0].editorEvent.content);
        }),

        eventStore.cClearState,
        cRemove
      ])),
    ])
  );

  Pipeline.async({}, VERSIONS.map(sTestVersion), success, failure);
});