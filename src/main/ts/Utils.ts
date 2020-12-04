/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { eventPropTypes, IEventPropTypes } from './components/EditorPropTypes';
import { IAllProps } from './components/Editor';
import { Editor as TinyMCEEditor, EditorEvent } from 'tinymce';

export const isFunction = (x: unknown): x is Function => typeof x === 'function';

const isEventProp = (name: string): name is keyof IEventPropTypes => {
  return name in eventPropTypes;
};

const eventAttrToEventName = <T extends string>(attrName: `on${string & T}`): T => {
  return attrName.substr(2) as T;
}

export const bindHandlers = (editor: TinyMCEEditor, prevProps: Partial<IAllProps>, props: Partial<IAllProps>, boundHandlers: Record<string, (event: EditorEvent<unknown>) => unknown>): void => {
  const prevEventKeys = Object.keys(prevProps).filter(isEventProp);
  const currEventKeys = Object.keys(props).filter(isEventProp);

  const removedKeys = prevEventKeys.filter((key) => !currEventKeys.includes(key));
  const changedKeys = currEventKeys.filter((key) => prevEventKeys.includes(key) && prevProps[key] != props[key]);
  const addedKeys = currEventKeys.filter((key) => !prevEventKeys.includes(key));

  [...removedKeys, ...changedKeys].forEach((key) => {
    // remove event handler
    const eventName = eventAttrToEventName(key);
    const wrappedHandler = boundHandlers[eventName];
    editor.off(eventName, wrappedHandler);
    delete boundHandlers[eventName];
  });

  [...changedKeys, ...addedKeys].forEach((key) => {
    // add event handler
    const handler = props[key];
    if (isFunction(handler)) {
      const eventName = eventAttrToEventName(key);
      const wrappedHandler = (e: EditorEvent<unknown>) => handler(e as any, editor);
      boundHandlers[eventName] = wrappedHandler;
      editor.on(eventName, wrappedHandler);
    }
  });
};

let unique = 0;

export const uuid = (prefix: string): string => {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);

  unique++;

  return prefix + '_' + random + unique + String(time);
};

export const isTextarea = (element: Element | null): element is HTMLTextAreaElement => {
  return element !== null && element.tagName.toLowerCase() === 'textarea';
};

const normalizePluginArray = (plugins?: string | string[]): string[] => {
  if (typeof plugins === 'undefined' || plugins === '') {
    return [];
  }

  return Array.isArray(plugins) ? plugins : plugins.split(' ');
};

export const mergePlugins = (initPlugins: string | string[] | undefined, inputPlugins: string | string[] | undefined): string[] => {
  return normalizePluginArray(initPlugins).concat(normalizePluginArray(inputPlugins));
};
