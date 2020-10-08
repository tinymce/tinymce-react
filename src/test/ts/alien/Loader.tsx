import { Chain, NamedChain } from '@ephox/agar';
import { Fun, Optional } from '@ephox/katamari';
import { SugarElement, SugarNode } from '@ephox/sugar';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RawEditorSettings } from 'tinymce';
import { Editor, IAllProps } from '../../../main/ts/components/Editor';
import { Editor as TinyMCEEditor } from 'tinymce';

export interface Context {
  DOMNode: HTMLElement;
  editor: TinyMCEEditor;
  ref: React.RefObject<Editor>;
}

const getRoot = () => {
  return Optional.from(document.getElementById('root')).getOrThunk(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    return root;
  });
};

const cRender = (props: IAllProps) => {
  return Chain.async<unknown, Context>((_, next, die) => {
    const originalInit = props.init || {};
    const originalSetup = originalInit.setup || Fun.noop;
    const ref = React.createRef<Editor>();

    const init: RawEditorSettings = {
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
            .fold(() => die('Could not find DOMNode'), (DOMNode) => {
              next({
                ref,
                editor,
                DOMNode
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
    ReactDOM.render(<div><Editor ref={ref} {...props} init={init} /></div>, getRoot());
  });
};

// By rendering the Editor into the same root, React will perform a diff and update.
const cReRender = (props: IAllProps) => {
  return Chain.op<Context>((context) => {
    ReactDOM.render(<div><Editor ref={context.ref} {...props} /></div>, getRoot());
  });
};

const cRemove = Chain.op((_) => {
  ReactDOM.unmountComponentAtNode(getRoot());
});

const cNamedChainDirect = (name: keyof Context) => NamedChain.direct(
  NamedChain.inputName(),
  Chain.mapper((res: Context) => res[name]),
  name
);

const cDOMNode = (chain: Chain<Context['DOMNode'], unknown>): Chain<Context, Context> => {
  return NamedChain.asChain<Context>([
    cNamedChainDirect('DOMNode'),
    NamedChain.read('DOMNode', chain),
    NamedChain.outputInput
  ]);
};

const cEditor = (chain: Chain<Context['editor'], unknown>): Chain<Context, Context> => {
  return NamedChain.asChain<Context>([
    cNamedChainDirect('editor'),
    NamedChain.read('editor', chain),
    NamedChain.outputInput
  ]);
};

export {
  cRender,
  cReRender,
  cRemove,
  cDOMNode,
  cEditor
};
