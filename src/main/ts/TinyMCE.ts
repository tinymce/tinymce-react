/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/**
 * Delibrately incomplete type for TinyMCE configuration.
 * Add items as needed for the integration. Do not expose this type.
 */
export interface TinymceConfig {
  target: Element | null;
  readonly?: boolean;
  inline?: boolean;
  plugins?: string[];
  toolbar?: any;
  setup?: (editor: TinymceEditor) => void;
}

interface StringPathBookmark {
  start: string;
  end?: string;
}

interface RangeBookmark {
  rng: Range;
}

interface IdBookmark {
  id: string;
  keep?: boolean;
}

interface IndexBookmark {
  name: string;
  index: number;
}

interface PathBookmark {
  start: number[];
  end?: number[];
}

export type TinymceBookmark = StringPathBookmark | RangeBookmark | IdBookmark | IndexBookmark | PathBookmark;

/**
 * Delibrately incomplete type for the TinyMCE editor.
 * Add items as needed for the integration. Do not expose this type.
 */
export interface TinymceEditor {
  initialized: boolean;
  getContent(settings?: { format?: 'html' | 'text' }): string;
  setContent(content: string): void;
  setMode(mode: 'readonly' | 'design'): void;
  on(eventName: string, eventHandler: (evt: unknown) => void): void;
  off(eventName: string, eventHandler?: Function): void;
  selection: {
    getBookmark(type?: number, normalise?: boolean): TinymceBookmark;
    moveToBookmark(bookmark: TinymceBookmark): boolean;
  }
}

/**
 * Delibrately incomplete type for the TinyMCE global.
 * Add items as needed for the integration. Do not expose this type.
 */
export interface TinymceGlobal {
  init(settings: TinymceConfig): Promise<TinymceEditor[]>;
  remove(editor: TinymceEditor): void;
  Editor: any;
}

const getGlobal = (): any => (typeof window !== 'undefined' ? window : global);

const getTinymce = (): TinymceGlobal | null => {
  const global = getGlobal();

  return global && global.tinymce ? global.tinymce : null;
};

const getTinymceOrError = (errorMessage = 'Global tinymce was not found.'): TinymceGlobal => {
  const tinymce = getTinymce();
  if (tinymce === null) {
    throw new Error(errorMessage);
  }
  return tinymce;
}

export { getTinymce, getTinymceOrError };
