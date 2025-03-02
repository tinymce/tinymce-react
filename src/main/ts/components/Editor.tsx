import * as React from 'react';
import type { Bookmark, EditorEvent, TinyMCE, Editor as TinyMCEEditor } from 'tinymce';
import { IEvents } from '../Events';
import { ScriptItem, ScriptLoader } from '../ScriptLoader2';
import { getTinymce } from '../TinyMCE';
import {
  configHandlers,
  isBeforeInputEventAvailable,
  isFunction,
  isInDoc,
  isTextareaOrInput,
  mergePlugins,
  setMode,
  uuid
} from '../Utils';
import { EditorPropTypes } from './EditorPropTypes';

type OmitStringIndexSignature<T> = { [K in keyof T as string extends K ? never : K]: T[K] };

interface DoNotUse<T extends string> {
  __brand: T;
}

type OmittedInitProps = 'selector' | 'target' | 'readonly' | 'license_key';

type EditorOptions = Parameters<TinyMCE['init']>[0];

export type InitOptions = Omit<OmitStringIndexSignature<EditorOptions>, OmittedInitProps> & {
  selector?: DoNotUse<'selector prop is handled internally by the component'>;
  target?: DoNotUse<'target prop is handled internally by the component'>;
  readonly?: DoNotUse<'readonly prop is overridden by the component, use the `disabled` prop instead'>;
  license_key?: DoNotUse<'license_key prop is overridden by the integration, use the `licenseKey` prop instead'>;
} & { [key: string]: unknown };

export type Version = `${'4' | '5' | '6' | '7'}${'' | '-dev' | '-testing' | `.${number}` | `.${number}.${number}`}`;

export interface IProps {
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#apikey React Tech Ref - apiKey}
   * @description TinyMCE API key for deployments using Tiny Cloud.
   */
  apiKey: string;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#id React Tech Ref - id}
   * @description The ID of the element to render the editor into.
   */
  id: string;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#inline React Tech Ref - inline}
   * @description Whether the editor should be rendered inline. Equivalent to the `inline` option in TinyMCE.
   */
  inline: boolean;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#initialvalue React Tech Ref - initialValue}
   * @description The initial HTML content of the editor.
   *
   * IMPORTANT: Ensure that this is **not** updated by `onEditorChange` or the editor will be unusable.
   */
  initialValue: string;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#oneditorchange React Tech Ref - onEditorChange}
   * @description Used to store the state of the editor outside the component. Typically used for controlled components.
   * @param a The current HTML content of the editor.
   * @param editor The TinyMCE editor instance.
   * @returns void
   */
  onEditorChange: (a: string, editor: TinyMCEEditor) => void;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#value React Tech Ref - value}
   * @description The current HTML content of the editor. Typically used for controlled components.
   */
  value: string;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#init React Tech Ref - init}
   * @description Additional settings passed to `tinymce.init()` when initializing the editor.
   */
  init: InitOptions;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#tagname React Tech Ref - tagName}
   * @description The tag name of the element to render the editor into. Only valid when `inline` is `true`.
   */
  tagName: string;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#tabIndex React Tech Ref - tabIndex}
   * @description The tab index of the element that the editor wraps.
   */
  tabIndex: number;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#cloudchannel React Tech Ref - cloudChannel}
   * @description The TinyMCE build to use when loading from Tiny Cloud.
   */
  cloudChannel: Version;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#plugins React Tech Ref - plugins}
   * @description The plugins to load into the editor. Equivalent to the `plugins` option in TinyMCE.
   */
  plugins: NonNullable<EditorOptions['plugins']>;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#toolbar React Tech Ref - toolbar}
   * @description The toolbar to load into the editor. Equivalent to the `toolbar` option in TinyMCE.
   */
  toolbar: NonNullable<EditorOptions['toolbar']>;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#disabled React Tech Ref - disabled}
   * @description Whether the editor should be "disabled" (read-only).
   */
  disabled: boolean;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#textareaname React Tech Ref - textareaName}
   * @description Set the `name` attribute of the `textarea` element used for the editor in forms. Only valid in iframe mode.
   */
  textareaName: string;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#tinymcescriptsrc React Tech Ref - tinymceScriptSrc}
   * @description The URL of the TinyMCE script to lazy load.
   */
  tinymceScriptSrc: string | string[] | ScriptItem[];
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#rollback React Tech Ref - rollback}
   * @description The number of milliseconds to wait before reverting to the previous value when the editor's content changes.
   */
  rollback: number | false;
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#scriptloading React Tech Ref - scriptLoading}
   * @description Options for how the TinyMCE script should be loaded.
   * @property async Whether the script should be loaded with the `async` attribute.
   * @property defer Whether the script should be loaded with the `defer` attribute.
   * @property delay The number of milliseconds to wait before loading the script.
   */
  scriptLoading: {
    async?: boolean;
    defer?: boolean;
    delay?: number;
  };
  /**
   * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/#licenseKey React Tech Ref - licenseKey}
   * @description Tiny Cloud License Key for when self-hosting TinyMCE.
   */
  licenseKey: string;
}

export interface IAllProps extends Partial<IProps>, Partial<IEvents> { }

/**
 * @see {@link https://www.tiny.cloud/docs/tinymce/7/react-ref/ TinyMCE React Technical Reference}
 */
export const Editor: React.FC<IAllProps> = (props) => {
  const {
    cloudChannel = '7',
    tinymceScriptSrc,
    onScriptsLoad,
    onScriptsLoadError,
    initialValue,
    value,
    rollback,
    onEditorChange,
  } = props;
  const editorRef = React.useRef<TinyMCEEditor>();
  const elementRef = React.useRef<HTMLElement>(null);
  const [ id ] = React.useState(props.id || uuid('tiny-react'));
  const inline = React.useMemo(() => props.inline ?? props.init?.inline ?? false, [ props.inline, props.init?.inline ]);
  const boundHandlersRef = React.useRef<Record<string, (event: EditorEvent<unknown>) => unknown>>({});
  const rollbackTimerRef = React.useRef<number>();
  const [ valueCursor, setValueCursor ] = React.useState<Bookmark>();

  const view = elementRef.current?.ownerDocument.defaultView ?? window;

  // Add other necessary useEffect hooks for handling prop changes
  //
  const changeEvents = React.useCallback(() => {
    const isIE = getTinymce(view)?.Env?.browser?.isIE();
    return (isIE
      ? 'change keyup compositionend setcontent CommentChange'
      : 'change input compositionend setcontent CommentChange'
    );
  }, [ view ]);

  const beforeInputEvent = React.useCallback(() => isBeforeInputEventAvailable() ? 'beforeinput SelectionChange' : 'SelectionChange', []);

  const renderInline = () => {
    const { tagName = 'div' } = props;

    return React.createElement(tagName, {
      ref: elementRef,
      id,
      tabIndex: props.tabIndex
    });
  };

  const renderIframe = () => React.createElement('textarea', {
    ref: elementRef,
    style: { visibility: 'hidden' },
    name: props.textareaName,
    id,
    tabIndex: props.tabIndex
  });

  const getScriptSources = () => {
    const async = props.scriptLoading?.async;
    const defer = props.scriptLoading?.defer;
    if (tinymceScriptSrc !== undefined) {
      if (typeof tinymceScriptSrc === 'string') {
        return [{ src: tinymceScriptSrc, async, defer }];
      }
      // multiple scripts can be specified which allows for hybrid mode
      return tinymceScriptSrc.map((item) => {
        if (typeof item === 'string') {
          // async does not make sense for multiple items unless
          // they are not dependent (which will be unlikely)
          return { src: item, async, defer };
        } else {
          return item;
        }
      });
    }
    // fallback to the cloud when the tinymceScriptSrc is not specified
    const channel = cloudChannel as Version; // `cloudChannel` is in `defaultProps`, so it's always defined.
    const apiKey = props.apiKey ? props.apiKey : 'no-api-key';
    const cloudTinyJs = `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${channel}/tinymce.min.js`;
    return [{ src: cloudTinyJs, async, defer }];
  };

  const getInitialValue = () => {
    if (typeof initialValue === 'string') {
      return initialValue;
    } else if (typeof value === 'string') {
      return value;
    } else {
      return '';
    }
  };

  const rollbackChange = React.useCallback(() => {
    const editor = editorRef.current;
    const content = editor?.getContent();
    if (editor && value && value !== content) {
      editor.undoManager.ignore(() => {
        editor.setContent(value);
        // only restore cursor on inline editors when they are focused
        // as otherwise it will cause a focus grab
        if (valueCursor && (!inline || editor.hasFocus())) {
          try {
            editor.selection.moveToBookmark(valueCursor);
          } catch (e) { /* ignore */ }
        }
      });
    }
    rollbackTimerRef.current = undefined;
  }, [ value, inline, valueCursor ]);

  const bindHandlers = React.useCallback(() => {
    if (editorRef.current !== undefined) {
      // typescript chokes trying to understand the type of the lookup function
      configHandlers(editorRef.current, props, boundHandlersRef.current, (key) => props[key] as any);
      // check if we should monitor editor changes
    }
  }, [ props ]);

  const handleBeforeInput = React.useCallback((_evt: EditorEvent<unknown>) => {
    const content = editorRef.current?.getContent();
    if (value !== undefined && value === content && editorRef.current) {
      if (!inline || editorRef.current.hasFocus()) {
        try {
          // getBookmark throws exceptions when the editor has not been focused
          // possibly only in inline mode but I'm not taking chances
          setValueCursor(editorRef.current.selection.getBookmark(3));
        } catch (e) { /* ignore */ }
      }
    }
  }, [ value, inline ]);

  const handleBeforeInputSpecial = React.useCallback((evt: EditorEvent<KeyboardEvent>) => {
    if (evt.key === 'Enter' || evt.key === 'Backspace' || evt.key === 'Delete') {
      handleBeforeInput(evt);
    }
  }, [ handleBeforeInput ]);

  const handleEditorChange = React.useCallback((_evt: EditorEvent<unknown>) => {
    const currentEditor = editorRef.current;
    if (currentEditor && currentEditor.initialized) {
      const newContent = currentEditor.getContent();
      if (value !== undefined && value !== newContent && rollback !== false) {
        // start a timer and revert to the value if not applied in time
        if (!rollbackTimerRef.current) {
          rollbackTimerRef.current = window.setTimeout(
            rollbackChange,
            typeof rollback === 'number' ? rollback : 200
          );
        }
      }

      if (isFunction(onEditorChange)) {
        onEditorChange(newContent, currentEditor);
      }
    }
  }, [ value, onEditorChange, rollback, rollbackChange ]);

  const handleEditorChangeSpecial = React.useCallback((evt: EditorEvent<KeyboardEvent>) => {
    if (evt.key === 'Backspace' || evt.key === 'Delete') {
      handleEditorChange(evt);
    }
  }, [ handleEditorChange ]);

  React.useEffect(() => {
    if (editorRef.current !== undefined) {
      // check if we should monitor editor changes
      const isValueControlled = onEditorChange !== undefined || value !== undefined;
      if (isValueControlled) {
        editorRef.current.on(changeEvents(), handleEditorChange);
        editorRef.current.on(beforeInputEvent(), handleBeforeInput);
        editorRef.current.on('keydown', handleBeforeInputSpecial);
        editorRef.current.on('keyup', handleEditorChangeSpecial);
        editorRef.current.on('NewBlock', handleEditorChange);
      } else {
        editorRef.current.off(changeEvents(), handleEditorChange);
        editorRef.current.off(beforeInputEvent(), handleBeforeInput);
        editorRef.current.off('keydown', handleBeforeInputSpecial);
        editorRef.current.off('keyup', handleEditorChangeSpecial);
        editorRef.current.off('NewBlock', handleEditorChange);
      }
    }
  }, [
    onEditorChange,
    value,
    handleEditorChange,
    handleBeforeInput,
    handleBeforeInputSpecial,
    handleEditorChangeSpecial,
    beforeInputEvent,
    changeEvents
  ]);

  const initialise = React.useCallback((attempts = 0) => {
    const target = elementRef.current;
    if (!target) {
      return; // Editor has been unmounted
    }
    if (!isInDoc(target)) {
      // is probably someone trying to help by rendering us offscreen
      // but we can't do that because the editor iframe must be in the document
      // in order to have state
      if (attempts === 0) {
        // we probably just need to wait for the current events to be processed
        setTimeout(() => initialise(1), 1);
      } else if (attempts < 100) {
        // wait for ten seconds, polling every tenth of a second
        setTimeout(() => initialise(attempts + 1), 100);
      } else {
        // give up, at point it seems that more polling is unlikely to help
        throw new Error('tinymce can only be initialised when in a document');
      }
      return;
    }

    const tinymce = getTinymce(view);
    if (!tinymce) {
      throw new Error('tinymce should have been loaded into global scope');
    }

    const finalInit: EditorOptions = {
      ...props.init as Omit<InitOptions, OmittedInitProps>,
      selector: undefined,
      target,
      readonly: props.disabled,
      inline,
      plugins: mergePlugins(props.init?.plugins, props.plugins),
      toolbar: props.toolbar ?? props.init?.toolbar,
      ...(props.licenseKey ? { license_key: props.licenseKey } : {}),
      setup: (ed) => {
        editorRef.current = ed;
        bindHandlers();

        // When running in inline mode the editor gets the initial value
        // from the innerHTML of the element it is initialized on.
        // However we don't want to take on the responsibility of sanitizing
        // to remove XSS in the react integration so we have a chicken and egg
        // problem... We avoid it by sneaking in a set content before the first
        // "official" setContent and using TinyMCE to do the sanitization.
        if (inline && !isTextareaOrInput(target)) {
          ed.once('PostRender', (_evt) => {
            ed.setContent(getInitialValue(), { no_events: true });
          });
        }

        if (props.init && isFunction(props.init.setup)) {
          props.init.setup(ed);
        }
      },
      init_instance_callback: (editor) => {
        // check for changes that happened since tinymce.init() was called
        const retrievedInitialValue = getInitialValue();
        const currentEditorContent = editor.getContent();
        if (currentEditorContent !== retrievedInitialValue) {
          // same as resetContent in TinyMCE 5
          editor.setContent(retrievedInitialValue);
          editor.undoManager.clear();
          editor.undoManager.add();
          editor.setDirty(false);
        }
        const disabled = props.disabled ?? false;
        setMode(editor, disabled ? 'readonly' : 'design');
        // ensure existing init_instance_callback is called
        if (props.init && isFunction(props.init.init_instance_callback)) {
          props.init.init_instance_callback(editor);
        }
      }
    };
    if (!inline) {
      target.style.visibility = '';
    }
    if (isTextareaOrInput(target)) {
      target.value = getInitialValue();
    }

    tinymce.init(finalInit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (getTinymce(view) !== null) {
      initialise();
    } else if (Array.isArray(tinymceScriptSrc) && tinymceScriptSrc.length === 0) {
      onScriptsLoadError?.(new Error('No `tinymce` global is present but the `tinymceScriptSrc` prop was an empty array.'));
    } else if (elementRef.current?.ownerDocument) {
      const successHandler = () => {
        onScriptsLoad?.();
        initialise();
      };
      const errorHandler = (err: unknown) => {
        onScriptsLoadError?.(err);
      };
      ScriptLoader.loadList(
        elementRef.current.ownerDocument,
        getScriptSources(),
        props.scriptLoading?.delay ?? 0,
        successHandler,
        errorHandler
      );
    }

    const boundHandlers = boundHandlersRef.current;

    return () => {
      const editor = editorRef.current;
      if (editor) {
        editor.off(changeEvents(), handleEditorChange);
        editor.off(beforeInputEvent(), handleBeforeInput);
        editor.off('keypress', handleEditorChangeSpecial);
        editor.off('keydown', handleBeforeInputSpecial);
        editor.off('NewBlock', handleEditorChange);
        Object.keys(boundHandlers).forEach((eventName) => {
          editor.off(eventName, boundHandlers[eventName]);
        });
        boundHandlersRef.current = {};
        editor.remove();
        editorRef.current = undefined;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (editorRef.current) {
      bindHandlers();
    }
  });

  React.useEffect(() => {
    if (rollbackTimerRef.current) {
      clearTimeout(rollbackTimerRef.current);
      rollbackTimerRef.current = undefined;
    }
    if (editorRef.current) {
      if (editorRef.current.initialized) {
        const editorContent = editorRef.current.getContent();
        if (typeof initialValue === 'string') {
          // same as resetContent in TinyMCE 5
          editorRef.current.setContent(initialValue);
          editorRef.current.undoManager.clear();
          editorRef.current.undoManager.add();
          editorRef.current.setDirty(false);
        } else if (typeof value === 'string' && value !== editorContent) {
          const localEditor = editorRef.current;
          localEditor.undoManager.transact(() => {
            // inline editors grab focus when restoring selection
            // so we don't try to keep their selection unless they are currently focused
            let cursor: Bookmark | undefined;
            if (!inline || localEditor.hasFocus()) {
              try {
                // getBookmark throws exceptions when the editor has not been focused
                // possibly only in inline mode but I'm not taking chances
                cursor = localEditor.selection.getBookmark(3);
              } catch (e) { /* ignore */ }
            }
            localEditor.setContent(value as string);
            if (!inline || localEditor.hasFocus()) {
              for (const bookmark of [ cursor, valueCursor ]) {
                if (bookmark) {
                  try {
                    localEditor.selection.moveToBookmark(bookmark);
                    setValueCursor(bookmark);
                    break;
                  } catch (e) { /* ignore */ }
                }
              }
            }
          });
        }
        if (props.disabled) {
          const disabled = props.disabled ?? false;
          setMode(editorRef.current, disabled ? 'readonly' : 'design');
        }
      }
    }
  }, [ initialValue, inline, props.disabled, value, valueCursor ]);

  return inline ? renderInline() : renderIframe();
};

Editor.propTypes = EditorPropTypes;
