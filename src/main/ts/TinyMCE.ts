import { TinyMCE as TinyMCEGlobal } from 'tinymce';
import { IAllProps } from './components/Editor';

const getTinymce = (props: IAllProps, view: Window): TinyMCEGlobal | null => {
  const global = view as any;
  const elementName = props.globalElementName || 'tinymce';

  return global && global[elementName] ? global[elementName] : null;
};

export { getTinymce };
