/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ValidationMap } from 'prop-types';
import * as React from 'react';
import { IEvents } from '../Events';
import * as ScriptLoader from '../ScriptLoader';
import { getTinymce } from '../TinyMCE';
import { bindHandlers, isTextarea, mergePlugins, uuid } from '../Utils';
import { EditorPropTypes, IEditorPropTypes } from './EditorPropTypes';

export interface IProps {
  apiKey: string;
  id: string;
  inline: boolean;
  initialValue: string;
  init: Record<string, any>;
  tagName: string;
  cloudChannel: string;
  plugins: string | string[];
  toolbar: string | string[];
}

export interface IAllProps extends Partial<IProps>, Partial<IEvents> {}
const scriptState = ScriptLoader.create();

export class Editor extends React.Component<IAllProps> {
  public static propTypes: IEditorPropTypes = EditorPropTypes;
  private element: Element | null = null;
  private id: string;
  private editor: any;
  private inline: boolean;

  public componentWillMount() {
    this.id = this.id || this.props.id || uuid('tiny-react');
    this.inline = this.props.inline ? this.props.inline : this.props.init && this.props.init.inline;
  }

  public componentDidMount() {
    if (getTinymce() !== null) {
      this.initialise();
    } else if (this.element) {
      const doc = this.element.ownerDocument;
      const channel = this.props.cloudChannel ? this.props.cloudChannel : 'stable';
      const apiKey = this.props.apiKey ? this.props.apiKey : '';

      ScriptLoader.load(scriptState, doc, `https://cloud.tinymce.com/${channel}/tinymce.min.js?apiKey=${apiKey}`, this.initialise);
    }
  }

  public componentWillUnmount() {
    this.cleanUp();
  }

  public render() {
    return this.inline ? this.renderInline() : this.renderIframe();
  }

  private initialise = () => {
    const initialValue = typeof this.props.initialValue === 'string' ? this.props.initialValue : '';
    const finalInit = {
      ...this.props.init,
      target: this.element,
      inline: this.inline,
      plugins: mergePlugins(this.props.init && this.props.init.plugins, this.props.plugins),
      toolbar: this.props.toolbar || (this.props.init && this.props.init.toolbar),
      setup: (editor: any) => {
        this.editor = editor;
        editor.on('init', () => editor.setContent(initialValue));
        bindHandlers(this.props, editor);

        if (this.props.init && typeof this.props.init.setup === 'function') {
          this.props.init.setup(editor);
        }
      }
    };

    if (isTextarea(this.element)) {
      this.element.style.visibility = '';
    }

    getTinymce().init(finalInit);
  };

  private renderInline() {
    const { tagName = 'div' } = this.props;

    return React.createElement(tagName, {
      ref: (elm) => (this.element = elm),
      id: this.id
    });
  }

  private renderIframe() {
    return <textarea ref={(elm) => (this.element = elm)} style={{ visibility: 'hidden' }} id={this.id} />;
  }

  private cleanUp() {
    getTinymce().remove(this.editor);
  }
}
