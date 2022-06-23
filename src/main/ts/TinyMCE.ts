/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { TinyMCE as TinyMCEGlobal } from 'tinymce';

const getTinymce = (window: Window): TinyMCEGlobal | null => {
  const global = window as any;

  return global && global.tinymce ? global.tinymce : null;
};

export { getTinymce };
