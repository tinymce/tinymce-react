import { Fun, Optional } from '@ephox/katamari';
import { Remove, SugarElement, SugarNode } from '@ephox/sugar';
import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Editor, IAllProps, IProps, Version } from '../../../main/ts/components/Editor';
import { Editor as TinyMCEEditor } from 'tinymce';
import { before, context } from '@ephox/bedrock-client';
import { VersionLoader } from '@tinymce/miniature';
import { setMode } from 'src/main/ts/Utils';

// @ts-expect-error Remove when dispose polyfill is not needed
Symbol.dispose ??= Symbol('Symbol.dispose');
// @ts-expect-error Remove when dispose polyfill is not needed
Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose');

export interface Context {
  DOMNode: HTMLElement;
  editor: TinyMCEEditor;
  ref: React.RefObject<Editor>;
}

const getRoot = () => Optional.from(document.getElementById('root')).getOrThunk(() => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  return root;
});
export interface ReactEditorContext extends Context, Disposable {
  reRender(props: IAllProps): Promise<void>;
  remove(): void;
}

export const render = async (props: Partial<IAllProps> = {}, container: HTMLElement = getRoot()): Promise<ReactEditorContext> => {
  const originalInit = props.init || {};
  const originalSetup = originalInit.setup || Fun.noop;
  const ref = React.createRef<Editor>();
  const root = ReactDOMClient.createRoot(container);

  const ctx = await new Promise<Context>((resolve, reject) => {
    const init: IProps['init'] = {
      ...originalInit,
      setup: (editor) => {
        originalSetup(editor);

        editor.on('SkinLoaded', () => {
          setTimeout(() => {
            Optional.from(ref.current)
              .bind((editorInstance) => Optional.from(editorInstance.editor?.targetElm))
              .map(SugarElement.fromDom)
              .filter(SugarNode.isHTMLElement)
              .map((val) => val.dom)
              .fold(() => reject('Could not find DOMNode'), (DOMNode) => {
                resolve({
                  ref: ref as React.RefObject<Editor>,
                  editor,
                  DOMNode,
                });
              }
              );
          }, 0);
        });
      }
    };

    /**
     * NOTE: TinyMCE will manipulate the DOM directly and this may cause issues with React's virtual DOM getting
     * out of sync. The official fix for this is wrap everything (textarea + editor) in an element. As far as React
     * is concerned, the wrapper always only has a single child, thus ensuring that React doesn’t have a reason to
     * touch the nodes created by TinyMCE. Since this only seems to be an issue when rendering TinyMCE 4 directly
     * into a root and a fix would be a breaking change, let's just wrap the editor in a <div> here for now.
     */
    root.render(<div><Editor ref={ref} apiKey='no-api-key' {...props} init={init} /></div>);
  });

  const remove = () => {
    root.unmount();
    Remove.remove(SugarElement.fromDom(container));
  };

  return {
    ...ctx,
    /** By rendering the Editor into the same root, React will perform a diff and update. */
    reRender: (newProps: IAllProps) => new Promise<void>((resolve) => {
      root.render(<div><Editor apiKey='no-api-key' ref={ctx.ref} {...newProps} /></div>);

      if (newProps.disabled) {
        setMode(ctx.editor, 'readonly');
      }

      newProps.value
        ? ctx.editor.once('change', (_event) => resolve())
        : resolve();
    }),
    remove,
    [Symbol.dispose]: remove
  };
};

type RenderWithVersion = (
  props: Omit<IAllProps, 'cloudChannel' | 'tinymceScriptSrc'>,
  container?: HTMLElement | HTMLDivElement
) => Promise<ReactEditorContext>;

export const withVersion = (version: Version, fn: (render: RenderWithVersion) => void): void => {
  context(`TinyMCE (${version})`, () => {
    before(async () => {
      await VersionLoader.pLoadVersion(version);
    });

    fn(render as RenderWithVersion);
  });
};
