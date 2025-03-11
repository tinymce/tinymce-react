import { Assertions } from '@ephox/agar';
import { context, describe, it } from '@ephox/bedrock-client';

import { VALID_API_KEY, VERSIONS } from '../alien/TestHelpers';
import * as Loader from '../alien/Loader';
import { TinyAssertions } from '@ephox/mcagar';
import { IAllProps } from 'src/main/ts';

const assertProperty = (obj: {}, propName: string, expected: unknown) => {
  Assertions.assertEq(propName.toString() + ' should be ' + expected, expected, (obj as any)[propName]);
};

describe('EditorInitTest', () => {
  VERSIONS.forEach((version) =>
    Loader.withVersion(version, (renderWithVersion) => {
      const defaultProps: IAllProps = { apiKey: VALID_API_KEY, cloudChannel: version };
      const render = (props: IAllProps = {}) => renderWithVersion({ ...defaultProps, ...props });

      context('tagName prop changes element', () => {
        it('is div by default for inline', async () => {
          using ctx = await render({ inline: true });
          assertProperty(ctx.DOMNode, 'tagName', 'DIV');
        });

        it('can be set to inline in init', async () => {
          using ctx = await render({ init: { inline: true }});
          assertProperty(ctx.DOMNode, 'tagName', 'DIV');
        });

        it('can be changed to p', async () => {
          using ctx = await render({ inline: true, tagName: 'p' });
          assertProperty(ctx.DOMNode, 'tagName', 'P');
        });

        it('iframe editor does not change element', async () => {
          using ctx = await render({ tagName: 'p' });
          assertProperty(ctx.DOMNode, 'tagName', 'TEXTAREA');
        });
      });

      context('id is set automatically if id prop not provided', () => {
        it('is set normally if prop is provided', async () => {
          using ctx = await render({ id: 'test' });
          assertProperty(ctx.DOMNode, 'id', 'test');
        });

        it('gets set automatically to uuid if not set', async () => {
          using ctx = await render();
          Assertions.assertEq('Should not be uuid', typeof ctx.DOMNode.id === 'string' && ctx.DOMNode.id.indexOf('tiny-react') !== -1, true);
        });
      });

      context('sets name on form', () => {
        it('is not set when prop is not provided', async () => {
          using ctx = await render();
          assertProperty(ctx.DOMNode, 'name', '');
        });

        it('is set when prop is provided', async () => {
          using ctx = await render({ textareaName: 'test' });
          assertProperty(ctx.DOMNode, 'name', 'test');
        });
      });

      it('Value prop should propagate changes to editor', async () => {
        using ctx = await render({ value: '<p>Initial Value</p>' });
        TinyAssertions.assertContent(ctx.editor, '<p>Initial Value</p>');
        await ctx.reRender({ ...defaultProps, value: '<p>New Value</p>' });
        TinyAssertions.assertContent(ctx.editor, '<p>New Value</p>');
      });

      it('Disabled prop should disable editor', async () => {
        using ctx = await render();
        Assertions.assertEq('Should be design mode', true, '4' === version ? !ctx.editor.readonly : ctx.editor.mode.get() === 'design');
        await ctx.reRender({ ...defaultProps, disabled: true });
        Assertions.assertEq('Should be readonly mode', true, '4' === version ? ctx.editor.readonly : ctx.editor.mode.get() === 'readonly');
      });

      it('Using an overriden props will cause a TS error', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        using _ = await render({
          init: {
            // @ts-expect-error Overriden props
            target: document.createElement('div'), readonly: true, selector: 'textarea#my-id', license_key: 'gpl'
          }
        });
      });

      it('Assigning other unknown props to the editor is allowed', async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        using _ = await render({
          init: {
            mergetags_list: [{
              title: 'Client',
              menu: [
                {
                  value: 'Client.LastCallDate',
                  title: 'Call date'
                },
                {
                  value: 'Client.Name',
                  title: 'Client name'
                }
              ]
            }],
            something_else: 'value'
          }
        });
      });
    })
  );
});
