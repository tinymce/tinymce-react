import { Type } from '@ephox/katamari';
import type { EditorEvent, Editor as TinyMCEEditor } from 'tinymce';
import { IAllProps } from './components/Editor';
import { eventPropTypes, IEventPropTypes } from './components/EditorPropTypes';

export const isFunction = (x: unknown): x is Function => typeof x === 'function';

const isEventProp = (name: string): name is keyof IEventPropTypes => name in eventPropTypes;

const eventAttrToEventName = <T extends string>(attrName: `on${T}`): T => attrName.substr(2) as T;

type PropLookup = <K extends keyof IAllProps>(key: K) => IAllProps[K] | undefined;

export const configHandlers2 = <H> (
  handlerLookup: PropLookup,
  on: (name: string, handler: H) => void,
  off: (name: string, handler: H) => void,
  adapter: <K extends keyof IEventPropTypes> (lookup: PropLookup, key: K) => H,
  props: Partial<IAllProps>,
  boundHandlers: Record<string, H>
): void => {
  const eventKeys: Array<keyof IEventPropTypes> = Object.keys(eventPropTypes) as Array<keyof IEventPropTypes>;
  const currEventKeys = Object.keys(props).filter(isEventProp);
  const unboundEventKeys = eventKeys.filter((key) => props[key] === undefined);

  unboundEventKeys.forEach((key) => {
    // remove event handler
    const eventName = eventAttrToEventName(key);
    const wrappedHandler = boundHandlers[eventName];
    if (Type.isNonNullable(wrappedHandler)) {
      off(eventName, wrappedHandler);
      delete boundHandlers[eventName];
    }
  });

  currEventKeys.forEach((key) => {
    const wrappedHandler = adapter(handlerLookup, key);
    const eventName = eventAttrToEventName(key);
    if (wrappedHandler !== boundHandlers[eventName]) {
      boundHandlers[eventName] = wrappedHandler;
      on(eventName, wrappedHandler);
    }
  });
};

const adapterMemo = (() => {
  const cache = new Map<TinyMCEEditor, <K extends keyof IEventPropTypes> (lookup: PropLookup, key: K) => (e: any) => unknown>();
  return (editor: TinyMCEEditor) => {
    let result = cache.get(editor);
    const lookupCache = new Map<keyof IEventPropTypes, [any, (e: any) => unknown]>();
    if (!result) {
      result = (handlerLookup, key) => {
        if (!lookupCache.has(key) || lookupCache.get(key)?.[0] !== handlerLookup(key)) {
          lookupCache.set(key, [ handlerLookup(key), (e) => handlerLookup(key)?.(e, editor) ]);
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return lookupCache.get(key)![1];
      };
      cache.set(editor, result);
    }
    return result;
  };

})();

export const configHandlers = (
  editor: TinyMCEEditor,
  props: Partial<IAllProps>,
  boundHandlers: Record<string, (event: EditorEvent<any>) => unknown>,
  lookup: PropLookup
): void =>
  configHandlers2(
    lookup,
    editor.on.bind(editor),
    editor.off.bind(editor),
    adapterMemo(editor),
    props,
    boundHandlers
  );

let unique = 0;

export const uuid = (prefix: string): string => {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);

  unique++;

  return prefix + '_' + random + unique + String(time);
};

export const isTextareaOrInput = (element: Element | null): element is (HTMLTextAreaElement | HTMLInputElement) =>
  element !== null && (element.tagName.toLowerCase() === 'textarea' || element.tagName.toLowerCase() === 'input');

const normalizePluginArray = (plugins?: string | string[]): string[] => {
  if (typeof plugins === 'undefined' || plugins === '') {
    return [];
  }

  return Array.isArray(plugins) ? plugins : plugins.split(' ');
};

// eslint-disable-next-line max-len
export const mergePlugins = (initPlugins: string | string[] | undefined, inputPlugins: string | string[] | undefined): string[] => normalizePluginArray(initPlugins).concat(normalizePluginArray(inputPlugins));

export const isBeforeInputEventAvailable = () => window.InputEvent && typeof (InputEvent.prototype as any).getTargetRanges === 'function';

export const isInDoc = (elem: Node) => {
  if (!('isConnected' in Node.prototype)) {
    // Fallback for IE and old Edge
    let current = elem;
    let parent = elem.parentNode;
    while (parent != null) {
      current = parent;
      parent = current.parentNode;
    }
    return current === elem.ownerDocument;
  }

  return elem.isConnected;
};

export const setMode = (editor: TinyMCEEditor | undefined, mode: 'readonly' | 'design') => {
  if (editor !== undefined) {
    if (editor.mode != null && typeof editor.mode === 'object' && typeof editor.mode.set === 'function') {
      editor.mode.set(mode);
    } else { // support TinyMCE 4
      (editor as any).setMode(mode);
    }
  }
};
