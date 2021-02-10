/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { IEvents } from '../Events';
import { ScriptLoader } from '../ScriptLoader';
import { getTinymce } from '../TinyMCE';
import { isFunction, isTextarea, mergePlugins, uuid, configHandlers } from '../Utils';
import { EditorPropTypes, IEditorPropTypes } from './EditorPropTypes';
import { Editor as TinyMCEEditor, EditorEvent, Events, RawEditorSettings } from 'tinymce';
import { textToHtml } from '../TextToHtml';

export interface IProps {
  apiKey: string;
  id: string;
  inline: boolean;
  initialValue: string;
  onEditorChange: (a: string, editor: TinyMCEEditor) => void;
  value: string;
  init: RawEditorSettings & { selector?: undefined; target?: undefined };
  outputFormat: 'html' | 'text';
  tagName: string;
  cloudChannel: string;
  plugins: NonNullable<RawEditorSettings['plugins']>;
  toolbar: NonNullable<RawEditorSettings['toolbar']>;
  disabled: boolean;
  textareaName: string;
  tinymceScriptSrc: string;
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
    cloudChannel: '5'
  };

  private id: string;
  private elementRef: React.RefObject<HTMLElement>;
  private editor?: TinyMCEEditor;
  private inline: boolean;
  private currentContent?: string;
  private boundHandlers: Record<string, (event: EditorEvent<unknown>) => unknown>;

  public constructor(props: Partial<IAllProps>) {
    super(props);
    this.id = this.props.id || uuid('tiny-react');
    this.elementRef = React.createRef<HTMLElement>();
    this.inline = this.props.inline ?? this.props.init?.inline ?? false;
    this.boundHandlers = {};
  }

  public componentDidUpdate(prevProps: Partial<IAllProps>) {
    if (this.editor && this.editor.initialized) {
      this.bindHandlers(prevProps);
      this.currentContent = this.currentContent ?? this.editor.getContent({ format: this.props.outputFormat });

      if (typeof this.props.value === 'string' && this.props.value !== prevProps.value && this.props.value !== this.currentContent) {
        const localEditor = this.editor;
        const value = this.props.outputFormat === 'text' ? textToHtml(this.props.value) : this.props.value;
        localEditor.undoManager.transact(() => localEditor.setContent(value));
      }
      if (typeof this.props.disabled === 'boolean' && this.props.disabled !== prevProps.disabled) {
        this.editor.setMode(this.props.disabled ? 'readonly' : 'design');
      }
    }
  }

  public componentDidMount() {
    if (getTinymce() !== null) {
      this.initialise();
    } else if (this.elementRef.current && this.elementRef.current.ownerDocument) {
      ScriptLoader.load(
        this.elementRef.current.ownerDocument,
        this.getScriptSrc(),
        this.props.scriptLoading?.async ?? false,
        this.props.scriptLoading?.defer ?? false,
        this.props.scriptLoading?.delay ?? 0,
        this.initialise
      );
    }
  }

  public componentWillUnmount() {
    const editor = this.editor;
    if (editor) {
      editor.off('init', this.handleInit);
      if (editor.initialized) {
        editor.off('change keyup setcontent', this.handleEditorChange);
        Object.keys(this.boundHandlers).forEach((eventName) => {
          editor.off(eventName, this.boundHandlers[eventName]);
        });
        this.boundHandlers = {};
      }
      editor.remove();
    }
  }

  public render() {
    return this.inline ? this.renderInline() : this.renderIframe();
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

  private getScriptSrc() {
    if (typeof this.props.tinymceScriptSrc === 'string') {
      return this.props.tinymceScriptSrc;
    } else {
      const channel = this.props.cloudChannel;
      const apiKey = this.props.apiKey ? this.props.apiKey : 'no-api-key';
      return `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${channel}/tinymce.min.js`;
    }
  }

  private getInitialValue() {
    if (typeof this.props.value === 'string') {
      return this.props.value;
    } else if (typeof this.props.initialValue === 'string') {
      return this.props.initialValue;
    } else {
      return '';
    }
  }

  private bindHandlers(prevProps: Partial<IAllProps>) {
    if (this.editor !== undefined) {
      // typescript chokes trying to understand the type of the lookup function
      configHandlers(this.editor, prevProps, this.props, this.boundHandlers, (key) => this.props[key] as any);
    }
  }

  private handleEditorChange = (_evt: EditorEvent<unknown>) => {
    const editor = this.editor;
    if (editor) {
      const newContent = editor.getContent({ format: this.props.outputFormat });

      if (newContent !== this.currentContent) {
        this.currentContent = newContent;
        if (isFunction(this.props.onEditorChange)) {
          this.props.onEditorChange(this.currentContent ?? '', editor);
        }
      }
    }
  };

  private handleInit = (initEvent: EditorEvent<Events.EditorEventMap['init']>) => {
    const editor = this.editor;
    if (editor) {
      const initialValue = this.getInitialValue();
      editor.setContent(this.props.outputFormat === 'text' ? textToHtml(initialValue) : initialValue );
      editor.undoManager.clear();
      editor.undoManager.add();
      editor.setDirty(false);

      if (isFunction(this.props.onEditorChange)) {
        editor.on('change keyup setcontent', this.handleEditorChange);
      }

      if (isFunction(this.props.onInit)) {
        this.props.onInit(initEvent, editor);
      }

      this.bindHandlers({});
    }
  };

  private initialise = () => {
    const target = this.elementRef.current;
    if (!target) {
      return; // Editor has been unmounted
    }

    const tinymce = getTinymce();
    if (!tinymce) {
      throw new Error('tinymce should have been loaded into global scope');
    }

    const finalInit: RawEditorSettings = {
      ...this.props.init,
      selector: undefined,
      target,
      readonly: this.props.disabled,
      inline: this.inline,
      plugins: mergePlugins(this.props.init && this.props.init.plugins, this.props.plugins),
      toolbar: this.props.toolbar || (this.props.init && this.props.init.toolbar),
      setup: (editor) => {
        this.editor = editor;
        editor.on('init', this.handleInit);

        if (this.props.init && isFunction(this.props.init.setup)) {
          this.props.init.setup(editor);
        }
      }
    };

    if (isTextarea(this.elementRef.current)) {
      this.elementRef.current.style.visibility = '';
    }

    tinymce.init(finalInit);
  };
}
