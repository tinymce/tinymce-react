import * as React from 'react';
import { IEvents } from '../Events';
import { ScriptItem, ScriptLoader } from '../ScriptLoader2';
import { getTinymce } from '../TinyMCE';
import { isFunction, isTextareaOrInput, mergePlugins, uuid, configHandlers, isBeforeInputEventAvailable, isInDoc, setMode } from '../Utils';
import { EditorPropTypes, IEditorPropTypes } from './EditorPropTypes';
import { Bookmark, Editor as TinyMCEEditor, EditorEvent, TinyMCE } from 'tinymce';

type EditorOptions = Parameters<TinyMCE['init']>[0];

export interface IProps {
  apiKey: string;
  id: string;
  inline: boolean;
  initialValue: string;
  onEditorChange: (a: string, editor: TinyMCEEditor) => void;
  value: string;
  init: EditorOptions & { selector?: undefined; target?: undefined };
  tagName: string;
  cloudChannel: string;
  plugins: NonNullable<EditorOptions['plugins']>;
  toolbar: NonNullable<EditorOptions['toolbar']>;
  disabled: boolean;
  textareaName: string;
  tinymceScriptSrc: string | string[] | ScriptItem[];
  rollback: number | false;
  scriptLoading: {
    async?: boolean;
    defer?: boolean;
    delay?: number;
  };
}

export interface IAllProps extends Partial<IProps>, Partial<IEvents> { }

export class Editor extends React.Component<IAllProps> {
  public static propTypes: IEditorPropTypes = EditorPropTypes;

  public static defaultProps: Partial<IAllProps> = {
    cloudChannel: '6'
  };

  public editor?: TinyMCEEditor;

  private id: string;
  private elementRef: React.RefObject<HTMLElement>;
  private inline: boolean;
  private currentContent?: string;
  private boundHandlers: Record<string, (event: EditorEvent<unknown>) => unknown>;
  private rollbackTimer: number | undefined = undefined;
  private valueCursor: Bookmark | undefined = undefined;

  public constructor(props: Partial<IAllProps>) {
    super(props);
    this.id = this.props.id || uuid('tiny-react');
    this.elementRef = React.createRef<HTMLElement>();
    this.inline = this.props.inline ?? this.props.init?.inline ?? false;
    this.boundHandlers = {};
  }

  private get view() {
    return this.elementRef.current?.ownerDocument.defaultView ?? window;
  }

  public componentDidUpdate(prevProps: Partial<IAllProps>) {
    if (this.rollbackTimer) {
      clearTimeout(this.rollbackTimer);
      this.rollbackTimer = undefined;
    }
    if (this.editor) {
      this.bindHandlers(prevProps);
      if (this.editor.initialized) {
        this.currentContent = this.currentContent ?? this.editor.getContent();
        if (typeof this.props.initialValue === 'string' && this.props.initialValue !== prevProps.initialValue) {
          // same as resetContent in TinyMCE 5
          this.editor.setContent(this.props.initialValue);
          this.editor.undoManager.clear();
          this.editor.undoManager.add();
          this.editor.setDirty(false);
        } else if (typeof this.props.value === 'string' && this.props.value !== this.currentContent) {
          const localEditor = this.editor;
          localEditor.undoManager.transact(() => {
            // inline editors grab focus when restoring selection
            // so we don't try to keep their selection unless they are currently focused
            let cursor: Bookmark | undefined;
            if (!this.inline || localEditor.hasFocus()) {
              try {
                // getBookmark throws exceptions when the editor has not been focused
                // possibly only in inline mode but I'm not taking chances
                cursor = localEditor.selection.getBookmark(3);
              } catch (e) { /* ignore */ }
            }
            const valueCursor = this.valueCursor;
            localEditor.setContent(this.props.value as string);
            if (!this.inline || localEditor.hasFocus()) {
              for (const bookmark of [ cursor, valueCursor ]) {
                if (bookmark) {
                  try {
                    localEditor.selection.moveToBookmark(bookmark);
                    this.valueCursor = bookmark;
                    break;
                  } catch (e) { /* ignore */ }
                }
              }
            }
          });
        }
        if (this.props.disabled !== prevProps.disabled) {
          const disabled = this.props.disabled ?? false;
          setMode(this.editor, disabled ? 'readonly' : 'design');
        }
      }
    }
  }

  public componentDidMount() {
    if (getTinymce(this.view) !== null) {
      this.initialise();
    } else if (Array.isArray(this.props.tinymceScriptSrc) && this.props.tinymceScriptSrc.length === 0) {
      this.props.onScriptsLoadError?.(new Error('No `tinymce` global is present but the `tinymceScriptSrc` prop was an empty array.'));
    } else if (this.elementRef.current?.ownerDocument) {
      const successHandler = () => {
        this.props.onScriptsLoad?.();
        this.initialise();
      };
      const errorHandler = (err: unknown) => {
        this.props.onScriptsLoadError?.(err);
      };
      ScriptLoader.loadList(
        this.elementRef.current.ownerDocument,
        this.getScriptSources(),
        this.props.scriptLoading?.delay ?? 0,
        successHandler,
        errorHandler
      );
    }
  }

  public componentWillUnmount() {
    const editor = this.editor;
    if (editor) {
      editor.off(this.changeEvents(), this.handleEditorChange);
      editor.off(this.beforeInputEvent(), this.handleBeforeInput);
      editor.off('keypress', this.handleEditorChangeSpecial);
      editor.off('keydown', this.handleBeforeInputSpecial);
      editor.off('NewBlock', this.handleEditorChange);
      Object.keys(this.boundHandlers).forEach((eventName) => {
        editor.off(eventName, this.boundHandlers[eventName]);
      });
      this.boundHandlers = {};
      editor.remove();
      this.editor = undefined;
    }
  }

  public render() {
    return this.inline ? this.renderInline() : this.renderIframe();
  }

  private changeEvents() {
    const isIE = getTinymce(this.view)?.Env?.browser?.isIE();
    return (isIE
      ? 'change keyup compositionend setcontent CommentChange'
      : 'change input compositionend setcontent CommentChange'
    );
  }

  private beforeInputEvent() {
    return isBeforeInputEventAvailable() ? 'beforeinput SelectionChange' : 'SelectionChange';
  }

  private renderInline() {
    const { tagName = 'div' } = this.props;

    return React.createElement(tagName, {
      ref: this.elementRef,
      id: this.id
    });
  }

  private renderIframe() {
    return React.createElement('textarea', {
      ref: this.elementRef,
      style: { visibility: 'hidden' },
      name: this.props.textareaName,
      id: this.id
    });
  }

  private getScriptSources(): ScriptItem[] {
    const async = this.props.scriptLoading?.async;
    const defer = this.props.scriptLoading?.defer;
    if (this.props.tinymceScriptSrc !== undefined) {
      if (typeof this.props.tinymceScriptSrc === 'string') {
        return [{ src: this.props.tinymceScriptSrc, async, defer }];
      }
      // multiple scripts can be specified which allows for hybrid mode
      return this.props.tinymceScriptSrc.map((item) => {
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
    const channel = this.props.cloudChannel;
    const apiKey = this.props.apiKey ? this.props.apiKey : 'no-api-key';
    const cloudTinyJs = `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${channel}/tinymce.min.js`;
    return [{ src: cloudTinyJs, async, defer }];
  }

  private getInitialValue() {
    if (typeof this.props.initialValue === 'string') {
      return this.props.initialValue;
    } else if (typeof this.props.value === 'string') {
      return this.props.value;
    } else {
      return '';
    }
  }

  private bindHandlers(prevProps: Partial<IAllProps>) {
    if (this.editor !== undefined) {
      // typescript chokes trying to understand the type of the lookup function
      configHandlers(this.editor, prevProps, this.props, this.boundHandlers, (key) => this.props[key] as any);
      // check if we should monitor editor changes
      const isValueControlled = (p: Partial<IAllProps>) => p.onEditorChange !== undefined || p.value !== undefined;
      const wasControlled = isValueControlled(prevProps);
      const nowControlled = isValueControlled(this.props);
      if (!wasControlled && nowControlled) {
        this.editor.on(this.changeEvents(), this.handleEditorChange);
        this.editor.on(this.beforeInputEvent(), this.handleBeforeInput);
        this.editor.on('keydown', this.handleBeforeInputSpecial);
        this.editor.on('keyup', this.handleEditorChangeSpecial);
        this.editor.on('NewBlock', this.handleEditorChange);
      } else if (wasControlled && !nowControlled) {
        this.editor.off(this.changeEvents(), this.handleEditorChange);
        this.editor.off(this.beforeInputEvent(), this.handleBeforeInput);
        this.editor.off('keydown', this.handleBeforeInputSpecial);
        this.editor.off('keyup', this.handleEditorChangeSpecial);
        this.editor.off('NewBlock', this.handleEditorChange);
      }
    }
  }

  private rollbackChange = () => {
    const editor = this.editor;
    const value = this.props.value;
    if (editor && value && value !== this.currentContent) {
      editor.undoManager.ignore(() => {
        editor.setContent(value);
        // only restore cursor on inline editors when they are focused
        // as otherwise it will cause a focus grab
        if (this.valueCursor && (!this.inline || editor.hasFocus())) {
          try {
            editor.selection.moveToBookmark(this.valueCursor);
          } catch (e) { /* ignore */ }
        }
      });
    }
    this.rollbackTimer = undefined;
  };

  private handleBeforeInput = (_evt: EditorEvent<unknown>) => {
    if (this.props.value !== undefined && this.props.value === this.currentContent && this.editor) {
      if (!this.inline || this.editor.hasFocus()) {
        try {
          // getBookmark throws exceptions when the editor has not been focused
          // possibly only in inline mode but I'm not taking chances
          this.valueCursor = this.editor.selection.getBookmark(3);
        } catch (e) { /* ignore */ }
      }
    }
  };

  private handleBeforeInputSpecial = (evt: EditorEvent<KeyboardEvent>) => {
    if (evt.key === 'Enter' || evt.key === 'Backspace' || evt.key === 'Delete') {
      this.handleBeforeInput(evt);
    }
  };

  private handleEditorChange = (_evt: EditorEvent<unknown>) => {
    const editor = this.editor;
    if (editor && editor.initialized) {
      const newContent = editor.getContent();
      if (this.props.value !== undefined && this.props.value !== newContent && this.props.rollback !== false) {
        // start a timer and revert to the value if not applied in time
        if (!this.rollbackTimer) {
          this.rollbackTimer = window.setTimeout(
            this.rollbackChange,
            typeof this.props.rollback === 'number' ? this.props.rollback : 200
          );
        }
      }

      if (newContent !== this.currentContent) {
        this.currentContent = newContent;
        if (isFunction(this.props.onEditorChange)) {
          this.props.onEditorChange(newContent, editor);
        }
      }
    }
  };

  private handleEditorChangeSpecial = (evt: EditorEvent<KeyboardEvent>) => {
    if (evt.key === 'Backspace' || evt.key === 'Delete') {
      this.handleEditorChange(evt);
    }
  };

  private initialise = (attempts = 0) => {
    const target = this.elementRef.current;
    if (!target) {
      return; // Editor has been unmounted
    }
    if (!isInDoc(target)) {
      // this is probably someone trying to help by rendering us offscreen
      // but we can't do that because the editor iframe must be in the document
      // in order to have state
      if (attempts === 0) {
        // we probably just need to wait for the current events to be processed
        setTimeout(() => this.initialise(1), 1);
      } else if (attempts < 100) {
        // wait for ten seconds, polling every tenth of a second
        setTimeout(() => this.initialise(attempts + 1), 100);
      } else {
        // give up, at this point it seems that more polling is unlikely to help
        throw new Error('tinymce can only be initialised when in a document');
      }
      return;
    }

    const tinymce = getTinymce(this.view);
    if (!tinymce) {
      throw new Error('tinymce should have been loaded into global scope');
    }

    const finalInit: EditorOptions = {
      ...this.props.init,
      selector: undefined,
      target,
      readonly: this.props.disabled,
      inline: this.inline,
      plugins: mergePlugins(this.props.init?.plugins, this.props.plugins),
      toolbar: this.props.toolbar ?? this.props.init?.toolbar,
      setup: (editor) => {
        this.editor = editor;
        this.bindHandlers({});

        // When running in inline mode the editor gets the initial value
        // from the innerHTML of the element it is initialized on.
        // However we don't want to take on the responsibility of sanitizing
        // to remove XSS in the react integration so we have a chicken and egg
        // problem... We avoid it by sneaking in a set content before the first
        // "official" setContent and using TinyMCE to do the sanitization.
        if (this.inline && !isTextareaOrInput(target)) {
          editor.once('PostRender', (_evt) => {
            editor.setContent(this.getInitialValue(), { no_events: true });
          });
        }

        if (this.props.init && isFunction(this.props.init.setup)) {
          this.props.init.setup(editor);
        }
      },
      init_instance_callback: (editor) => {
        // check for changes that happened since tinymce.init() was called
        const initialValue = this.getInitialValue();
        this.currentContent = this.currentContent ?? editor.getContent();
        if (this.currentContent !== initialValue) {
          this.currentContent = initialValue;
          // same as resetContent in TinyMCE 5
          editor.setContent(initialValue);
          editor.undoManager.clear();
          editor.undoManager.add();
          editor.setDirty(false);
        }
        const disabled = this.props.disabled ?? false;
        setMode(this.editor, disabled ? 'readonly' : 'design');
        // ensure existing init_instance_callback is called
        if (this.props.init && isFunction(this.props.init.init_instance_callback)) {
          this.props.init.init_instance_callback(editor);
        }
      }
    };
    if (!this.inline) {
      target.style.visibility = '';
    }
    if (isTextareaOrInput(target)) {
      target.value = this.getInitialValue();
    }

    tinymce.init(finalInit);
  };
}
