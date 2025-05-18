import { context, describe, it } from '@ephox/bedrock-client';
import * as Loader from '../alien/Loader';
import { Assertions, Waiter } from '@ephox/agar';

describe('EditorDisabledTest', () => {

  context('with TinyMCE < 7.6', () => {
    Loader.withVersion('7.5', (render) => {
      it('updating disabled prop should toggle the editor\'s mode', async () => {
        using ctx = await render({
          disabled: true
        });

        Assertions.assertEq('mode is readonly', 'readonly', ctx.editor.mode.get());

        await ctx.reRender({
          disabled: false
        });
        await Waiter.pTryUntil('mode is changed to design', () => {
          Assertions.assertEq('mode is design', 'design', ctx.editor.mode.get());
        });
      });

      it('updating readonly prop should toggle the editor\'s mode', async () => {
        using ctx = await render({
          readonly: true
        });
        Assertions.assertEq('mode is readonly', 'readonly', ctx.editor.mode.get());

        await ctx.reRender({
          readonly: false
        });
        await Waiter.pTryUntil('mode is changed to design', () => {
          Assertions.assertEq('mode is design', 'design', ctx.editor.mode.get());
        });
      });
    });
  });

  context('with TinyMCE >= 7.6', () => {
    Loader.withVersion('7', (render) => {
      it('updating disabled prop should only change the editor\'s state', async () => {
        using ctx = await render({
          disabled: true
        });

        Assertions.assertEq('mode is design', 'design', ctx.editor.mode.get());
        Assertions.assertEq('editor is disabled', true, ctx.editor.options.get('disabled'));

        await ctx.reRender({
          disabled: false
        });

        await Waiter.pTryUntil('editor\'s state should be updated', () => {
          Assertions.assertEq('mode is design', 'design', ctx.editor.mode.get());
          Assertions.assertEq('editor is not disabled', false, ctx.editor.options.get('disabled'));
        });
      });

      it('updating readonly prop should only change the editor\'s mode', async () => {
        using ctx = await render({
          readonly: true
        });
        Assertions.assertEq('mode is readonly', 'readonly', ctx.editor.mode.get());
        Assertions.assertEq('editor is not disabled', false, ctx.editor.options.get('disabled'));

        await ctx.reRender({
          readonly: false
        });
        await Waiter.pTryUntil('editor\'s mode should be updated', () => {
          Assertions.assertEq('mode is design', 'design', ctx.editor.mode.get());
          Assertions.assertEq('editor is not disabled', false, ctx.editor.options.get('disabled'));
        });
      });
    });
  });
});