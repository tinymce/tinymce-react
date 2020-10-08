/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { eventPropTypes, IEventPropTypes } from './components/EditorPropTypes';
import { IAllProps } from './components/Editor';
import { EventHandler } from './Events';
import { Editor as TinyMCEEditor, EditorEvent } from 'tinymce';

export const isFunction = (x: unknown): x is Function => typeof x === 'function';

const isEventProp = (name: string): name is keyof IEventPropTypes => {
  return name in eventPropTypes;
};

interface EventHandlerSet {
  handler: EventHandler<unknown>;
  eventName: string;
}

const findEventHandlers = (props: Partial<IAllProps>): EventHandlerSet[] => {
  return Object.keys(props)
    .filter(isEventProp)
    .filter((name) => isFunction(props[name]))
    .map((name) => ({
      handler: props[name] as EventHandler<unknown>,
      eventName: name.substring(2)
    }));
};

export const bindHandlers = (editor: TinyMCEEditor, props: Partial<IAllProps>, boundHandlers: Record<string, (event: EditorEvent<unknown>) => unknown>): void => {
  findEventHandlers(props).forEach((found) => {
    // Unbind old handler
    const oldHandler = boundHandlers[found.eventName];
    if (isFunction(oldHandler)) {
      editor.off(found.eventName, oldHandler);
    }

    // Bind new handler
    const newHandler = (e: EditorEvent<unknown>) => found.handler(e, editor);
    boundHandlers[found.eventName] = newHandler;
    editor.on(found.eventName, newHandler);
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
