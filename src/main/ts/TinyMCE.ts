import { TinyMCE as TinyMCEGlobal } from 'tinymce';

const getTinymce = (view: Window): TinyMCEGlobal | null => {
  const global = view as any;

  return global && global.rsTinymce ? global.rsTinymce : null;
};

export { getTinymce };
