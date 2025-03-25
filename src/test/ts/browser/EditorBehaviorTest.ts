import { PlatformDetection } from '@ephox/sand';
import * as Loader from '../alien/Loader';

import { describe, it } from '@ephox/bedrock-client';

import { Assertions, Waiter } from '@ephox/agar';
import { TinyAssertions, TinySelections } from '@ephox/mcagar';
import { EditorEvent, Events, Editor as TinyMCEEditor } from 'tinymce';
import { getTinymce } from '../../../main/ts/TinyMCE';
import { EventStore, VERSIONS } from '../alien/TestHelpers';

type SetContentEvent = EditorEvent<Events.EditorEventMap['SetContent']>;

describe('EditorBehaviourTest', () => {
  const browser = PlatformDetection.detect().browser;
  if (browser.isIE()) {
    // INT-2278: This test currently times out in IE so we are skipping it
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

  VERSIONS.forEach((version) =>
    Loader.withVersion(version, (render) => {
      it('Assert structure of tinymce and tinymce-react events', async () => {
        using ctx = await render({
          onEditorChange: eventStore.createHandler('onEditorChange'),
          onSetContent: eventStore.createHandler('onSetContent'),
        });

        // tinymce native event
        // initial content is empty as editor does not have a value or initialValue
        eventStore.each<SetContentEvent>('onSetContent', (events) => {
          // note that this difference in behavior in 5-6 may be a bug, the team is investigating
          Assertions.assertEq(
            'First arg should be event from Tiny',
            versionRegex.test(version) ? '<p><br data-mce-bogus="1"></p>' : '',
            events[0].editorEvent.content
          );
          Assertions.assertEq('Second arg should be editor', true, isEditor(events[0].editor));
        });
        eventStore.clearState();

        ctx.editor.setContent('<p>Initial Content</p>');
        // tinymce native event
        eventStore.each<SetContentEvent>('onSetContent', (events) => {
          Assertions.assertEq('onSetContent should have been fired once', 1, events.length);
          Assertions.assertEq(
            'First arg should be event from Tiny',
            '<p>Initial Content</p>',
            events[0].editorEvent.content
          );
          Assertions.assertEq('Second arg should be editor', true, isEditor(events[0].editor));
        });

        // tinymce-react unique event
        eventStore.each<string>('onEditorChange', (events) => {
          Assertions.assertEq('First arg should be new content', '<p>Initial Content</p>', events[0].editorEvent);
          Assertions.assertEq('Second arg should be editor', true, isEditor(events[0].editor));
        });
        eventStore.clearState();
      });

      it('onEditorChange should only fire when the editors content changes', async () => {
        using ctx = await render({
          onEditorChange: eventStore.createHandler('onEditorChange'),
        });

        ctx.editor.setContent('<p>Initial Content</p>');
        ctx.editor.setContent('<p>Initial Content</p>'); // Repeat

        eventStore.each('onEditorChange', (events) => {
          Assertions.assertEq('onEditorChange should have been fired once', 1, events.length);
        });
        eventStore.clearState();
      });

      it('Should be able to register an event handler after initial render', async () => {
        using ctx = await render({ initialValue: '<p>Initial Content</p>' });
        await ctx.reRender({ onSetContent: eventStore.createHandler('onSetContent') });

        TinyAssertions.assertContent(ctx.editor, '<p>Initial Content</p>');
        await Waiter.pWait(0); // Wait for React's state updates to complete before setting new content
        ctx.editor.setContent('<p>New Content</p>');

        eventStore.each<SetContentEvent>('onSetContent', (events) => {
          Assertions.assertEq(
            'Should have bound handler, hence new content',
            '<p>New Content</p>',
            events[0].editorEvent.content
          );
        });
        eventStore.clearState();
      });

      it('Providing a new event handler and re-rendering should unbind old handler and bind new handler', async () => {
        using ctx = await render({ onSetContent: eventStore.createHandler('InitialHandler') });
        eventStore.each<SetContentEvent>('InitialHandler', (events) => {
          Assertions.assertEq(
            'Initial content is empty as editor does not have a value or initialValue',
            // note that this difference in behavior in 5-6 may be a bug, the team is investigating
            versionRegex.test(version) ? '<p><br data-mce-bogus="1"></p>' : '',
            events[0].editorEvent.content
          );
        });
        eventStore.clearState();
        ctx.editor.setContent('<p>Initial Content</p>');
        await ctx.reRender({ onSetContent: eventStore.createHandler('NewHandler') });
        await Waiter.pWait(0); // Wait for React's state updates to complete before setting new content
        ctx.editor.setContent('<p>New Content</p>');

        eventStore.each<SetContentEvent>('InitialHandler', (events) => {
          Assertions.assertEq(
            'Initial handler should have been unbound, hence initial content',
            '<p>Initial Content</p>',
            events[0].editorEvent.content
          );
        });
        eventStore.each<SetContentEvent>('NewHandler', (events) => {
          Assertions.assertEq(
            'New handler should have been bound, hence new content',
            '<p>New Content</p>',
            events[0].editorEvent.content
          );
        });

        eventStore.clearState();
      });
      it('INT-3226: onEditorChange is triggered only once after calling insertContent', async () => {
        using ctx = await render({ onEditorChange: eventStore.createHandler('onEditorChange') });
        const { editor } = ctx;
        editor.setContent('<p>abc</p>');
        await Waiter.pTryUntilPredicate('Editor content is set to correct value', () => ctx.editor.getContent() === '<p>abc</p>');
        eventStore.clearState();
        TinySelections.setSelection(editor, [ 0, 0 ], 1, [ 0, 0 ], 2);
        editor.insertContent('e');
        await Waiter.pTryUntilPredicate('Editor content is set to correct value', () => ctx.editor.getContent() === '<p>aec</p>');
        eventStore.each<string>('onEditorChange', (events) => {
          Assertions.assertEq(
            'onEditorChange should have been triggered once',
            1,
            events.length
          );
        });
      });
    })
  );
});
