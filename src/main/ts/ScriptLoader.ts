/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { uuid } from './Utils';

export type CallbackFn = () => void;
export interface IStateObj {
  listeners: CallbackFn[];
  scriptId: string;
  scriptLoading: boolean;
  scriptLoaded: boolean;
}

const createState = (): IStateObj => ({
  listeners: [],
  scriptId: uuid('tiny-script'),
  scriptLoading: false,
  scriptLoaded: false
});

interface ScriptLoader {
  load: (doc: Document, url: string, async: boolean, defer: boolean, delay: number, callback: CallbackFn) => void;
  reinitialize: () => void;
}

const CreateScriptLoader = (): ScriptLoader => {
  let state: IStateObj = createState();

  const injectScriptTag = (scriptId: string, doc: Document, url: string, async: boolean, defer: boolean, callback: CallbackFn) => {
    const scriptTag = doc.createElement('script');
    scriptTag.referrerPolicy = 'origin';
    scriptTag.type = 'application/javascript';
    scriptTag.id = scriptId;
    scriptTag.src = url;
    scriptTag.async = async;
    scriptTag.defer = defer;

    const handler = () => {
      scriptTag.removeEventListener('load', handler);
      callback();
    };
    scriptTag.addEventListener('load', handler);
    if (doc.head) {
      doc.head.appendChild(scriptTag);
    }
  };

  const load = (doc: Document, url: string, async: boolean, defer: boolean, delay: number, callback: CallbackFn) => {

    const scriptTagInjection = () => injectScriptTag(
      state.scriptId, doc, url, async, defer,
      () => {
        state.listeners.forEach((fn) => fn());
        state.scriptLoaded = true;
      }
    );

    if (state.scriptLoaded) {
      callback();
    } else {
      state.listeners.push(callback);
      if (!state.scriptLoading) {
        state.scriptLoading = true;
        if (delay > 0) {
          setTimeout(scriptTagInjection, delay);
        } else {
          scriptTagInjection();
        }
      }
    }
  };

  // Only to be used by tests.
  const reinitialize = () => {
    state = createState();
  };

  return {
    load,
    reinitialize
  };
};

const ScriptLoader = CreateScriptLoader();

export {
  ScriptLoader
};