/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TinyMCE as TinyMCEGlobal } from "tinymce-5";

const getGlobal = (): any => (typeof window !== 'undefined' ? window : global);

const getTinymce = (): TinyMCEGlobal | null => {
  const global = getGlobal();

  return global && global.tinymce ? global.tinymce : null;
};

export { getTinymce };
