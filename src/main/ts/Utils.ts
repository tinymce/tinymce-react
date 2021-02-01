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

const isEventProp = (name: string): name is keyof IEventPropTypes => name in eventPropTypes;

const eventAttrToEventName = <T extends string>(attrName: `on${T}`): T => attrName.substr(2) as T;

type PropLookup = <K extends keyof IAllProps>(key: K) => IAllProps[K] | undefined;

export const configHandlers2 = <H> (
  handlerLookup: PropLookup,
  on: (name: string, handler: H) => void,
  off: (name: string, handler: H) => void,
  adapter: <K extends keyof IEventPropTypes> (lookup: PropLookup, key: K) => H,
  prevProps: Partial<IAllProps>,
  props: Partial<IAllProps>,
  boundHandlers: Record<string, H>
): void => {
  const prevEventKeys = Object.keys(prevProps).filter(isEventProp);
  const currEventKeys = Object.keys(props).filter(isEventProp);

  const removedKeys = prevEventKeys.filter((key) => props[key] === undefined);
  const addedKeys = currEventKeys.filter((key) => prevProps[key] === undefined);

  removedKeys.forEach((key) => {
    // remove event handler
    const eventName = eventAttrToEventName(key);
    const wrappedHandler = boundHandlers[eventName];
    off(eventName, wrappedHandler);
    delete boundHandlers[eventName];
  });

  addedKeys.forEach((key) => {
    const wrappedHandler = adapter(handlerLookup, key);
    const eventName = eventAttrToEventName(key);
    boundHandlers[eventName] = wrappedHandler;
    on(eventName, wrappedHandler);
  });
};

export const configHandlers = (
  editor: TinyMCEEditor,
  prevProps: Partial<IAllProps>,
  props: Partial<IAllProps>,
  boundHandlers: Record<string, (event: EditorEvent<any>) => unknown>,
  lookup: PropLookup
): void =>
  configHandlers2(
    lookup,
    editor.on.bind(editor),
    editor.off.bind(editor),
    (handlerLookup, key) => (e) => handlerLookup(key)?.(e, editor),
    prevProps,
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

export const isTextarea = (element: Element | null): element is HTMLTextAreaElement => element !== null && element.tagName.toLowerCase() === 'textarea';

const normalizePluginArray = (plugins?: string | string[]): string[] => {
  if (typeof plugins === 'undefined' || plugins === '') {
    return [];
  }

  return Array.isArray(plugins) ? plugins : plugins.split(' ');
};

// eslint-disable-next-line max-len
export const mergePlugins = (initPlugins: string | string[] | undefined, inputPlugins: string | string[] | undefined): string[] => normalizePluginArray(initPlugins).concat(normalizePluginArray(inputPlugins));
