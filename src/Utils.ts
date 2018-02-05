/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { EditorPropTypes } from './components/EditorPropTypes';

const isValidKey = (keys: string[]) => (key: string) =>
  keys.indexOf(key) !== -1;

export const bindHandlers = (props: any, editor: any): void => {
  Object.keys(props)
    .filter(isValidKey(Object.keys(EditorPropTypes)))
    .forEach((key: string) => {
      const handler = props[key];
      if (typeof handler === 'function') {
        editor.on(key.substring(2), (e: any) => handler(e, editor));
      }
    });
};

let unique = 0;

export const uuid = (prefix: string): string => {
  const date = new Date();
  const time = date.getTime();
  const random = Math.floor(Math.random() * 1000000000);

  unique++;

  return prefix + '_' + random + unique + String(time);
};

export const isTextarea = (
  element: Element | null
): element is HTMLTextAreaElement => {
  return element !== null && element.tagName.toLowerCase() === 'textarea';
};

const normalizePluginArray = (plugins?: string | string[]): string[] => {
  if (typeof plugins === 'undefined' || plugins === '') {
    return [];
  }

  return Array.isArray(plugins) ? plugins : plugins.split(' ');
};

export const mergePlugins = (
  initPlugins: string | string[],
  inputPlugins?: string | string[]
) =>
  normalizePluginArray(initPlugins).concat(normalizePluginArray(inputPlugins));
