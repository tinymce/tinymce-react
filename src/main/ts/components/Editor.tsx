/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as React from 'react';
import { EventHandler, IEvents } from '../Events';
import * as ScriptLoader from '../ScriptLoader';
import { getTinymce } from '../TinyMCE';
import { bindHandlers, isFunction, isTextarea, mergePlugins, uuid } from '../Utils';
import { EditorPropTypes, IEditorPropTypes } from './EditorPropTypes';

export interface IProps {
  apiKey: string;
  id: string;
  inline: boolean;
  initialValue: string;
  onEditorChange: EventHandler<any>;
  value: string;
  init: Record<string, any>;
  outputFormat: 'html' | 'text';
  tagName: string;
  cloudChannel: string;
  plugins: string | string[];
  toolbar: string | string[];
  disabled: boolean;
  textareaName: string;
}

export interface IAllProps extends Partial<IProps>, Partial<IEvents> {}
const scriptState = ScriptLoader.create();

export class Editor extends React.Component<IAllProps> {
  public static propTypes: IEditorPropTypes = EditorPropTypes;

  public static defaultProps: Partial<IAllProps> = {
    cloudChannel: '5'
  };

  private id: string;
  private elementRef: React.RefObject<Element>;
  private editor?: Record<any, any>;
  private inline: boolean;
  private currentContent?: string | null;
  private boundHandlers: Record<string, EventHandler<any>>;

  constructor (props: Partial<IAllProps>) {
    super(props);
    this.id = this.props.id || uuid('tiny-react');
    this.elementRef = React.createRef<Element>();
    this.inline = this.props.inline ? this.props.inline : this.props.init && this.props.init.inline;
    this.boundHandlers = {};
  }

  public componentDidUpdate (prevProps: Partial<IAllProps>) {
    if (this.editor && this.editor.initialized) {
      bindHandlers(this.editor, this.props, this.boundHandlers);

      this.currentContent = this.currentContent || this.editor.getContent({ format: this.props.outputFormat });

      if (typeof this.props.value === 'string' && this.props.value !== prevProps.value && this.props.value !== this.currentContent) {
        this.editor.setContent(this.props.value);
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
      const doc = this.elementRef.current.ownerDocument;
      const channel = this.props.cloudChannel;
      const apiKey = this.props.apiKey ? this.props.apiKey : 'no-api-key';

      ScriptLoader.load(scriptState, doc, `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${channel}/tinymce.min.js`, this.initialise);
    }
  }

  public componentWillUnmount() {
    if (getTinymce() !== null) {
      getTinymce().remove(this.editor);
    }
  }

  public render() {
    return this.inline ? this.renderInline() : this.renderIframe();
  }

  private initialise = () => {
    const finalInit = {
      ...this.props.init,
      target: this.elementRef.current,
      readonly: this.props.disabled,
      inline: this.inline,
      plugins: mergePlugins(this.props.init && this.props.init.plugins, this.props.plugins),
      toolbar: this.props.toolbar || (this.props.init && this.props.init.toolbar),
      setup: (editor: any) => {
        this.editor = editor;
        editor.on('init', (e: Event) => {
          this.initEditor(e, editor);
        });

        if (this.props.init && typeof this.props.init.setup === 'function') {
          this.props.init.setup(editor);
        }
      }
    };

    if (isTextarea(this.elementRef.current)) {
      this.elementRef.current.style.visibility = '';
    }

    getTinymce().init(finalInit);
  }

  private initEditor(initEvent: Event, editor: any) {
    const value =
      typeof this.props.value === 'string' ? this.props.value : typeof this.props.initialValue === 'string' ? this.props.initialValue : '';
    editor.setContent(value);

    if (isFunction(this.props.onEditorChange)) {
      editor.on('change keyup setcontent', (e: any) => {
        const newContent = editor.getContent({ format: this.props.outputFormat });

        if (newContent !== this.currentContent) {
          this.currentContent = newContent;
          if (isFunction(this.props.onEditorChange)) {
            this.props.onEditorChange(this.currentContent, editor);
          }
        }
      });
    }

    if (isFunction(this.props.onInit)) {
      this.props.onInit(initEvent, editor);
    }

    bindHandlers(editor, this.props, this.boundHandlers);
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
}
