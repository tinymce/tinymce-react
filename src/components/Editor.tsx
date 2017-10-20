import * as PropTypes from 'prop-types';
import * as React from 'react';
import { IEvents } from '../Events';
import { bindHandlers } from '../Utils';

declare const tinymce: any;

export interface IProps extends Partial<IEvents> {
  id: string;
  inline?: boolean;
  value?: string;
  init?: object;
}
export interface IState {
  editor: any;
  isActive: boolean;
}

export class Editor extends React.Component <IProps, IState> {
  public static propTypes: PropTypes.ValidationMap<any>;
  private element: HTMLTextAreaElement | HTMLDivElement = null;

  constructor() {
    super();
    this.state = {
      editor: null,
      isActive: false,
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
        },
    };
    this.element.style.display = '';
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
      // dangerouslySetInnerHTML={this.state.isActive ? null : {__html: value } }
      /> :
      <textarea
      ref={(elm) => { this.element = elm; }}
      style={{display: 'none'}}
      id={this.props.id}
      // defaultValue={this.state.isActive ? null : value}
      />
    );
  }

  private removeEditor() {
    tinymce.remove(this.state.editor);
    this.setState({ isActive: false });
  }
}

Editor.propTypes = {
  id: PropTypes.string,
  inline: PropTypes.bool,
  value: PropTypes.string,
  onActivate: PropTypes.func,
  onAddUndo: PropTypes.func,
  onBeforeAddUndo: PropTypes.func,
  onBeforeExecCommand: PropTypes.func,
  onBeforeGetContent: PropTypes.func,
  onBeforeRenderUI: PropTypes.func,
  onBeforeSetContent: PropTypes.func,
  onBeforepaste: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onClearUndos: PropTypes.func,
  onClick: PropTypes.func,
  onContextmenu: PropTypes.func,
  onCopy: PropTypes.func,
  onCut: PropTypes.func,
  onDblclick: PropTypes.func,
  onDeactivate: PropTypes.func,
  onDirty  : PropTypes.func,
  onDrag: PropTypes.func,
  onDragdrop: PropTypes.func,
  onDragend: PropTypes.func,
  onDraggesture: PropTypes.func,
  onDragover: PropTypes.func,
  onDrop: PropTypes.func,
  onExecCommand: PropTypes.func,
  onFocus: PropTypes.func,
  onFocusin: PropTypes.func,
  onFocusout: PropTypes.func,
  onGetContent: PropTypes.func,
  onHide: PropTypes.func,
  onInit: PropTypes.func,
  onKeydown: PropTypes.func,
  onKeypress: PropTypes.func,
  onKeyup: PropTypes.func,
  onLoadContent: PropTypes.func,
  onMousedown: PropTypes.func,
  onMouseenter: PropTypes.func,
  onMouseleave: PropTypes.func,
  onMousemove: PropTypes.func,
  onMouseout: PropTypes.func,
  onMouseover: PropTypes.func,
  onMouseup: PropTypes.func,
  onNodeChange: PropTypes.func,
  onObjectResizeStart: PropTypes.func,
  onObjectResized: PropTypes.func,
  onObjectSelected: PropTypes.func,
  onPaste: PropTypes.func,
  onPostProcess: PropTypes.func,
  onPostRender: PropTypes.func,
  onPreInit: PropTypes.func,
  onPreProcess: PropTypes.func,
  onProgressState: PropTypes.func,
  onRedo: PropTypes.func,
  onRemove: PropTypes.func,
  onReset: PropTypes.func,
  onSaveContent: PropTypes.func,
  onSelectionchange: PropTypes.func,
  onSetAttrib: PropTypes.func,
  onSetContent: PropTypes.func,
  onShow: PropTypes.func,
  onSubmit: PropTypes.func,
  onUndo: PropTypes.func,
  onVisualAid: PropTypes.func,
};
