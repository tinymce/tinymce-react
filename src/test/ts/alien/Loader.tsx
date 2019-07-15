import { Chain, NamedChain } from '@ephox/agar';
import { Fun, Option } from '@ephox/katamari';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Editor, IAllProps } from '../../../main/ts/components/Editor';
import 'tinymce/tinymce';

export interface Payload {
  DOMNode: Element;
  editor: any;
  ref: React.RefObject<Editor>;
}

const getRoot = () => {
  return Option.from(document.getElementById('root')).getOrThunk(() => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);
    return root;
  });
};

const cRender = (props: IAllProps) => {
  return Chain.async<Payload, Payload>((_, next, die) => {
    const originalInit = props.init || {};
    const originalSetup = originalInit.setup || Fun.noop;
    const ref: React.RefObject<Editor> = React.createRef();

    const init: Record<string, any> = {
      ...originalInit,
      base_url: `/project/node_modules/tinymce`,
      setup: (editor: any) => {
        originalSetup(editor);

        editor.on('SkinLoaded', () => {
          setTimeout(() => {
            Option.from(ref.current)
            .map(ReactDOM.findDOMNode)
            .filter((val) => val instanceof Element)
            .fold(() => die('Could not find DOMNode'), (DOMNode) => {
              next({
                ref,
                editor,
                DOMNode: DOMNode as Element
              });
            });
          }, 0);
        });
      }
    };

    ReactDOM.render(<Editor ref={ref} {...props} init={init} />, getRoot());
  });
};

// By rendering the Editor into the same root, React will perform a diff and update.
const cReRender = (props: IAllProps) => {
  return Chain.op<Payload>((payload) => {
    ReactDOM.render(<Editor ref={payload.ref} {...props} />, getRoot());
  });
};

const cRemove = Chain.op((_) => {
  ReactDOM.unmountComponentAtNode(getRoot());
});

const cNamedChainDirect = (name: keyof Payload) => NamedChain.direct(
  NamedChain.inputName(),
  Chain.mapper((res: Payload) => res[name]),
  name
);

const cDOMNode = (chain: Chain<any, any>) => {
  return NamedChain.asChain([
    cNamedChainDirect('DOMNode'),
    NamedChain.read('DOMNode', chain),
    NamedChain.outputInput
  ]);
};

const cEditor = (chain: Chain<any, any>) => {
  return NamedChain.asChain([
    cNamedChainDirect('editor'),
    NamedChain.read('editor', chain),
    NamedChain.outputInput
  ]);
};

export {
  cRender,
  cReRender,
  cRemove,
  cNamedChainDirect,
  cDOMNode,
  cEditor
};
