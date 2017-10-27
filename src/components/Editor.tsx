import { ValidationMap } from 'prop-types';
import * as React from 'react';
import { IEvents } from '../Events';
import { tinymce } from '../TinyMCE';
import { bindHandlers } from '../Utils';
import { EditorPropTypes } from './EditorPropTypes';

export interface IProps extends Partial<IEvents> {
  id: string;
  inline?: boolean;
  value?: string;
  init?: object;
}
export interface IState {
  editor: any;
}

export class Editor extends React.Component <IProps, IState> {
  public static propTypes: ValidationMap<any>;
  private element: HTMLTextAreaElement | HTMLDivElement = null;

  constructor() {
    super();
    this.state = {
      editor: null
    };
  }

  public componentDidMount() {
    const setupCallback = this.props.init;
    const finalInit = {...this.props.init,
      selector: `#${this.props.id}`,
      inline: this.props.inline,
        setup: (editor: any) => {
          this.setState({editor});
          editor.on('init', () => editor.setContent(this.props.value));
          bindHandlers(this.props, editor);
          if (typeof setupCallback === 'function') {
            setupCallback(editor);
          }
        }
    };
    this.element.style.visibility = '';
    tinymce.init(finalInit);
  }

  public componentWillUnmount() {
    this.removeEditor();
  }

  public render() {
    return (this.props.inline ?
      <div
      ref={(elm) => { this.element = elm; }}
      id={this.props.id}
      /> :
      <textarea
      ref={(elm) => { this.element = elm; }}
      style={{visibility: 'hidden'}}
      id={this.props.id}
      />
    );
  }

  private removeEditor() {
    tinymce.remove(this.state.editor);
  }
}

Editor.propTypes = EditorPropTypes;
