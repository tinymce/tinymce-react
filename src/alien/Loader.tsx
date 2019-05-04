import { Chain, NamedChain } from '@ephox/agar';
import { Fun, Option } from '@ephox/katamari';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getTinymce } from 'src/TinyMCE';
import { Editor, IAllProps } from '../components/Editor';
import 'tinymce/tinymce';

export interface Payload {
  DOMNode: Element;
  editor: any;
  ref: React.RefObject<Editor>;
  root: HTMLElement;
}

type OnEditorLoaded = (editor: any, ref: React.RefObject<Editor>) => void;

type TestEditor = (props: IAllProps) => JSX.Element;

const setTinymceBaseUrl = (baseUrl: string) => {
  const tinymce = getTinymce();
  const prefix = document.location.protocol + '//' + document.location.host;
  tinymce.baseURL = baseUrl.indexOf('://') === -1 ? prefix + baseUrl : baseUrl;
  tinymce.baseURI = new tinymce.util.URI(tinymce.baseURL);
};

const getTestEditor = (onLoaded: OnEditorLoaded): TestEditor => {
  return (props: IAllProps): JSX.Element => {
    const originalInit = props.init || {};
    const originalSetup = originalInit.setup || Fun.noop;
    const ref: React.RefObject<Editor> = React.createRef();

    const init: Record<string, any> = {
      ...originalInit,
      setup: (editor: any) => {
        originalSetup(editor);

        editor.on('SkinLoaded', () => {
          setTimeout(() => {
            onLoaded(editor, ref);
          }, 0);
        });
      }
    };

    setTinymceBaseUrl(init.base_url || `/project/node_modules/tinymce`);
    return <Editor ref={ref} {...props} init={init} />;
  };
};

const cSetup = (createElement: (Ed: TestEditor) => JSX.Element) => {
  return Chain.async<Payload, Payload>((_, next, die) => {
    const root = document.createElement('div');
    document.body.append(root);

    const onEditorLoaded: OnEditorLoaded = (editor, ref) => {
      Option.from(ref.current)
        .map(ReactDOM.findDOMNode)
        .filter((val) => val instanceof Element)
        .fold(() => die('Could not find DOMNode'), (DOMNode) => {
          next({
            ref,
            root,
            editor,
            DOMNode: DOMNode as Element
          });
        });
    };

    const testEditor = getTestEditor(onEditorLoaded);
    const editorElement = createElement(testEditor);
    ReactDOM.render(editorElement, root);
  });
};

const cRemove = Chain.op((res: Payload) => {
  ReactDOM.unmountComponentAtNode(res.root);
});

const cNamedChainDirect = (name: keyof Payload) => NamedChain.direct(
  NamedChain.inputName(),
  Chain.mapper((res: Payload) => res[name]),
  name
);

export {
  cSetup,
  cRemove,
  cNamedChainDirect
};
