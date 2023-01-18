import { uuid } from './Utils';

export type CallbackFn = () => void;

export interface ScriptItem {
  src: string;
  async?: boolean;
  defer?: boolean;
}

interface Id {
  id: string;
}

const injectScriptTag = (doc: Document, item: ScriptItem & Id, handler: (id: string, err?: unknown) => void) => {
  const scriptTag = doc.createElement('script');
  scriptTag.referrerPolicy = 'origin';
  scriptTag.type = 'application/javascript';
  scriptTag.id = item.id;
  scriptTag.src = item.src;
  scriptTag.async = item.async ?? false;
  scriptTag.defer = item.defer ?? false;

  const loadHandler = () => {
    scriptTag.removeEventListener('load', loadHandler);
    scriptTag.removeEventListener('error', errorHandler);
    handler(item.src);
  };
  const errorHandler = (err: unknown) => {
    scriptTag.removeEventListener('load', loadHandler);
    scriptTag.removeEventListener('error', errorHandler);
    handler(item.src, err);
  };

  scriptTag.addEventListener('load', loadHandler);
  scriptTag.addEventListener('error', errorHandler);

  if (doc.head) {
    doc.head.appendChild(scriptTag);
  }
};

interface ScriptState {
  id: string;
  src: string;
  done: boolean;
  error?: unknown;
  handlers: ((src: string, err?: unknown) => void)[];
}

const createDocumentScriptLoader = (doc: Document) => {
  let lookup: Record<string, ScriptState> = {};

  const scriptLoadOrErrorHandler = (src: string, err?: unknown) => {
    const item = lookup[src];
    item.done = true;
    item.error = err;
    for (const h of item.handlers) {
      h(src, err);
    }
    item.handlers = [];
  };

  const loadScripts = (items: ScriptItem[], success: () => void, failure?: (err: unknown) => void) => {
    // eslint-disable-next-line no-console
    const failureOrLog = (err: unknown) => failure !== undefined ? failure(err) : console.error(err);
    if (items.length === 0) {
      failureOrLog(new Error('At least one script must be provided'));
      return;
    }
    let successCount = 0;
    let failed = false;
    const loaded = (_src: string, err?: unknown) => {
      if (failed) {
        return;
      }
      if (err) {
        failed = true;
        failureOrLog(err);
      } else if (++successCount === items.length) {
        success();
      }
    };
    for (const item of items) {
      const existing = lookup[item.src];
      if (existing) {
        if (existing.done) {
          loaded(item.src, existing.error);
        } else {
          existing.handlers.push(loaded);
        }
      } else {
        // create a new entry
        const id = uuid('tiny-');
        lookup[item.src] = {
          id,
          src: item.src,
          done: false,
          error: null,
          handlers: [ loaded ],
        };
        injectScriptTag(doc, { id, ...item }, scriptLoadOrErrorHandler);
      }
    }
  };

  const deleteScripts = () => {
    for (const item of Object.values(lookup)) {
      const scriptTag = doc.getElementById(item.id);
      if (scriptTag != null && scriptTag.tagName === 'SCRIPT') {
        scriptTag.parentNode?.removeChild(scriptTag);
      }
    }
    lookup = {};
  };

  const getDocument = () => doc;

  return {
    loadScripts,
    deleteScripts,
    getDocument
  };
};

type DocumentScriptLoader = ReturnType<typeof createDocumentScriptLoader>;

const createScriptLoader = () => {
  const cache: DocumentScriptLoader[] = [];

  const getDocumentScriptLoader = (doc: Document) => {
    let loader = cache.find((l) => l.getDocument() === doc);
    if (loader === undefined) {
      loader = createDocumentScriptLoader(doc);
      cache.push(loader);
    }
    return loader;
  };

  const loadList = (doc: Document, items: ScriptItem[], delay: number, success: () => void, failure?: (err: unknown) => void) => {
    const doLoad = () => getDocumentScriptLoader(doc).loadScripts(items, success, failure);
    if (delay > 0) {
      setTimeout(doLoad, delay);
    } else {
      doLoad();
    }
  };

  const reinitialize = () => {
    for (let loader = cache.pop(); loader != null; loader = cache.pop()) {
      loader.deleteScripts();
    }
  };

  return {
    loadList,
    reinitialize
  };
};

export const ScriptLoader = createScriptLoader();