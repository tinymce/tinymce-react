import { Arr, Fun, Global, Optional, Strings } from '@ephox/katamari';
import { Attribute, Remove, SelectorFilter, SugarElement, SugarNode } from '@ephox/sugar';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Editor, IAllProps, IProps } from '../../../main/ts/components/Editor';
import { Editor as TinyMCEEditor } from 'tinymce';
import { ScriptLoader } from 'src/main/ts/ScriptLoader2';

// @ts-expect-error Remove when dispose polyfill is not needed
Symbol.dispose ??= Symbol('Symbol.dispose');
// @ts-expect-error Remove when dispose polyfill is not needed
Symbol.asyncDispose ??= Symbol('Symbol.asyncDispose');

export interface Context {
  DOMNode: HTMLElement;
  editor: TinyMCEEditor;
  ref: React.RefObject<Editor>;
  majorVersion: string;
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

const deleteTinymce = () => {
  ScriptLoader.reinitialize();

  delete Global.tinymce;
  delete Global.tinyMCE;
  const hasTinymceUri = (attrName: string) => (elm: SugarElement<Element>) =>
    Attribute.getOpt(elm, attrName).exists((src) => Strings.contains(src, 'tinymce'));

  const elements = Arr.flatten([
    Arr.filter(SelectorFilter.all('script'), hasTinymceUri('src')),
    Arr.filter(SelectorFilter.all('link'), hasTinymceUri('href')),
  ]);

  Arr.each(elements, Remove.remove);
};

export const render = async (props: Partial<IAllProps> = {}, container: HTMLElement = getRoot()): Promise<ReactEditorContext> => {
  const originalInit = props.init || {};
  const originalSetup = originalInit.setup || Fun.noop;
  const ref = React.createRef<Editor>();

  const context = await new Promise<Context>((resolve, reject) => {
    const init: IProps['init'] = {
      ...originalInit,
      setup: (editor) => {
        originalSetup(editor);

        editor.on('SkinLoaded', () => {
          setTimeout(() => {
            Optional.from(ref.current)
              .map(ReactDOM.findDOMNode)
              .bind(Optional.from)
              .map(SugarElement.fromDom)
              .filter(SugarNode.isHTMLElement)
              .map((val) => val.dom)
              .fold(() => reject('Could not find DOMNode'), (DOMNode) => {
                resolve({
                  ref,
                  editor,
                  DOMNode,
                  majorVersion: Global.tinymce.majorVersion
                });
              });
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
    ReactDOM.render(<div><Editor ref={ref} apiKey='no-api-key' {...props} init={init} /></div>, container);
  });

  const remove = () => {
    ReactDOM.unmountComponentAtNode(container);
    deleteTinymce();
  };

  return {
    ...context,
    /** By rendering the Editor into the same root, React will perform a diff and update. */
    reRender: (newProps: IAllProps) => new Promise<void>((resolve) =>
      ReactDOM.render(<div><Editor apiKey='no-api-key' ref={context.ref} {...newProps} /></div>, container, resolve)
    ),
    remove,
    [Symbol.dispose]: remove
  };
};
