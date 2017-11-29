import { uuid } from './Utils';

type callbackFn = () => void;

const listeners: callbackFn[] = [];
const scriptId = uuid('tiny-script');
let scriptLoaded = false;

const callListeners = () => {
  listeners.forEach((fn) => fn());
};

const injectScriptTag = (doc: Document, url: string, callback: callbackFn) => {
  const scriptTag = doc.createElement('script');
  scriptTag.type = 'application/javascript';
  scriptTag.id = scriptId;
  scriptTag.addEventListener('load', callback);
  scriptTag.src = url;
  doc.head.appendChild(scriptTag);
};

export const loadScript = (doc: Document, url: string, callback: callbackFn) => {
  if (scriptLoaded) {
    callback();
  } else {
    listeners.push(callback);
    if (!doc.getElementById(scriptId)) {
      injectScriptTag(doc, url, () => {
        callListeners();
        scriptLoaded = true;
      });
    }
  }
};
