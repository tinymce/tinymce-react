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

  private element: Element | null = null;
  private id?: string;
  private editor?: Record<any, any>;
  private inline?: boolean;
  private currentContent?: string | null;

  public componentWillMount() {
    this.id = this.id || this.props.id || uuid('tiny-react');
    this.inline = this.props.inline ? this.props.inline : this.props.init && this.props.init.inline;
  }

  public componentDidMount() {
    if (getTinymce() !== null) {
      this.initialise();
    } else if (this.element && this.element.ownerDocument) {
      const doc = this.element.ownerDocument;
      const channel = this.props.cloudChannel;
      const apiKey = this.props.apiKey ? this.props.apiKey : '';

      ScriptLoader.load(scriptState, doc, `https://cloud.tinymce.com/${channel}/tinymce.min.js?apiKey=${apiKey}`, this.initialise);
    }
  }

  public componentWillUnmount() {
    if (getTinymce() !== null) {
      getTinymce().remove(this.editor);
    }
  }

  public componentWillReceiveProps(nextProps: Partial<IProps>) {
    if (this.editor && this.editor.initialized) {
      this.currentContent = this.currentContent || this.editor.getContent();

      if (typeof nextProps.value === 'string' && nextProps.value !== this.props.value && nextProps.value !== this.currentContent) {
        this.editor.setContent(nextProps.value);
      }
      if (typeof nextProps.disabled === 'boolean' && nextProps.disabled !== this.props.disabled) {
        this.editor.setMode(nextProps.disabled ? 'readonly' : 'design');
      }
    }
  }

  public render() {
    return this.inline ? this.renderInline() : this.renderIframe();
  }

  private initialise = () => {
    const finalInit = {
      ...this.props.init,
      target: this.element,
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

    if (isTextarea(this.element)) {
      this.element.style.visibility = '';
    }

    getTinymce().init(finalInit);
  }

  private initEditor(initEvent: Event, editor: any) {
    const value =
      typeof this.props.value === 'string' ? this.props.value : typeof this.props.initialValue === 'string' ? this.props.initialValue : '';
    editor.setContent(value);

    if (isFunction(this.props.onEditorChange)) {
      editor.on('change keyup setcontent', (e: any) => {
        this.currentContent = editor.getContent();
        if (isFunction(this.props.onEditorChange)) {
          this.props.onEditorChange(this.currentContent, editor);
        }
      });
    }

    bindHandlers(this.props, editor, initEvent);
  }

  private renderInline() {
    const { tagName = 'div' } = this.props;

    return React.createElement(tagName, {
      ref: (elm) => (this.element = elm),
      id: this.id
    });
  }

  private renderIframe() {
    return <textarea ref={(elm) => (this.element = elm)} style={{ visibility: 'hidden' }} id={this.id} name={this.props.textareaName} />;
  }
}
