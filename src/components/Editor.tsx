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
import { tinymce } from '../TinyMCE';
import { bindHandlers, isTextarea, uuid } from '../Utils';
import { EditorPropTypes, IEditorPropTypes } from './EditorPropTypes';

export interface IProps {
  id: string;
  inline: boolean;
  initialValue: string;
  init: object;
  tagName: string;
}

export interface IAllProps extends Partial<IProps>, Partial<IEvents> {}

export class Editor extends React.Component<IAllProps> {
  public static propTypes: IEditorPropTypes = EditorPropTypes;
  private element: Element | null = null;
  private id: string;
  private editor: any;

  public componentWillMount() {
    this.id = this.id || this.props.id || uuid('tiny-react');
  }

  public componentDidMount() {
    const setupCallback = this.props.init;
    const finalInit = {
      ...this.props.init,
      selector: `#${this.id}`,
      inline: this.props.inline,
      setup: (editor: any) => {
        this.editor = editor;
        editor.on('init', () => editor.setContent(this.props.initialValue));
        bindHandlers(this.props, editor);
        if (typeof setupCallback === 'function') {
          setupCallback(editor);
        }
      }
    };

    if (isTextarea(this.element)) {
      this.element.style.visibility = '';
    }

    tinymce.init(finalInit);
  }

  public componentWillUnmount() {
    this.removeEditor();
  }

  public render() {
    return this.props.inline ? this.renderInline() : this.renderIframe();
  }

  private renderInline() {
    const { tagName = 'div' } = this.props;

    return React.createElement(tagName,
      {
        ref: (elm) => this.element = elm,
        id: this.id
      }
    );
}

private renderIframe() {
  return (
    <textarea
      ref={(elm) => {
        this.element = elm;
      }}
      style={{ visibility: 'hidden' }}
      id={this.id}
    />
  );
}

  private removeEditor() {
    tinymce.remove(this.editor);
  }
}
