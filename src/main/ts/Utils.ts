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

const eventAttrToEventName = <T extends string>(attrName: `on${T}`): T => {
  return attrName.substr(2) as T;
}

export const bindHandlers = (editor: TinyMCEEditor, prevProps: Partial<IAllProps>, props: Partial<IAllProps>, boundHandlers: Record<string, (event: EditorEvent<unknown>) => unknown>): void => {
  return bindHandlers2(editor.on.bind(editor), editor.off.bind(editor), (handler) => (e) => handler(e, editor), prevProps, props, boundHandlers);
};

export const bindHandlers2 = <H> (
    on: (name: string, handler: H) => void,
    off: (name: string, handler: H) => void,
    adapter: (handler: (event: EditorEvent<unknown>, editor: TinyMCEEditor) => unknown) => H,
    prevProps: Partial<IAllProps>,
    props: Partial<IAllProps>,
    boundHandlers: Record<string, H>
  ): void => {
  const prevEventKeys = Object.keys(prevProps).filter(isEventProp);
  const currEventKeys = Object.keys(props).filter(isEventProp);

  const removedKeys = prevEventKeys.filter((key) => props[key] === undefined);
  const changedKeys = currEventKeys.filter((key) => prevProps[key] !== undefined && prevProps[key] != props[key]);
  const addedKeys = currEventKeys.filter((key) => prevProps[key] === undefined);

  [...removedKeys, ...changedKeys].forEach((key) => {
    // remove event handler
    const eventName = eventAttrToEventName(key);
    const wrappedHandler = boundHandlers[eventName];
    off(eventName, wrappedHandler);
    delete boundHandlers[eventName];
  });

  [...changedKeys, ...addedKeys].forEach((key) => {
    // add event handler
    const handler = props[key];
    if (handler !== undefined) {
      const eventName = eventAttrToEventName(key);
      const wrappedHandler = adapter(handler as (event: EditorEvent<unknown>, editor: TinyMCEEditor) => unknown);
      boundHandlers[eventName] = wrappedHandler;
      on(eventName, wrappedHandler);
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
