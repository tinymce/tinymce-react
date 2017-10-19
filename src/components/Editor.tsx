import * as PropTypes from 'prop-types';
import * as React from 'react';
import { IEvents } from '../Events';
import { bindHandlers } from '../Utils';

declare const tinymce: any;

export interface IProps extends IEvents {
  id: string;
  inline: boolean;
  tinymce: any;
  onChange: any;
  value: string;
  init: object;
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
    setTimeout(() => {
      tinymce.init({
        selector: `#${this.props.id}`,
        inline: this.props.inline,
        setup: (editor: any) => {
          this.setState({editor});
          bindHandlers(this.props, editor);
        },
      });
      this.element.style.display = '';
    }, 1000);
  }

  public componentWillUnmount() {
    tinymce.remove(this.state.editor);
    this.setState({isActive: false});
  }

  public render() {
    const value = this.props.value;
    return (this.props.inline ?
      <div
        ref={(elm) => { this.element = elm; }}
        id={this.props.id}
        dangerouslySetInnerHTML={{__html: value }}
      /> :
      <textarea
        ref={(elm) => { this.element = elm; }}
        style={{display: 'none'}}
        id={this.props.id}
        defaultValue={value}
      />
    );
  }
}

Editor.propTypes = {
  id: PropTypes.string,
  inline: PropTypes.bool,
  value: PropTypes.string,
  onFocusin: PropTypes.func,
  onFocusout: PropTypes.func,
  onClick: PropTypes.func,
  onDblclick: PropTypes.func,
  onMousedown: PropTypes.func,
  onMouseup: PropTypes.func,
  onMousemove: PropTypes.func,
  onMouseover: PropTypes.func,
  onBeforepaste: PropTypes.func,
  onPaste: PropTypes.func,
  onCut: PropTypes.func,
  onCopy: PropTypes.func,
  onSelectionchange: PropTypes.func,
  onMouseout: PropTypes.func,
  onMouseenter: PropTypes.func,
  onMouseleave: PropTypes.func,
  onKeydown: PropTypes.func,
  onKeypress: PropTypes.func,
  onKeyup: PropTypes.func,
  onContextmenu: PropTypes.func,
  onDragend: PropTypes.func,
  onDragover: PropTypes.func,
  onDraggesture: PropTypes.func,
  onDragdrop: PropTypes.func,
  onDrop: PropTypes.func,
  onDrag: PropTypes.func,
  onBeforeRenderUI: PropTypes.func,
  onSetAttrib: PropTypes.func,
  onPreInit: PropTypes.func,
  onPostRender: PropTypes.func,
  onInit: PropTypes.func,
  onDeactivate: PropTypes.func,
  onActivate: PropTypes.func,
  onNodeChange: PropTypes.func,
  onBeforeExecCommand: PropTypes.func,
  onExecCommand: PropTypes.func,
  onShow: PropTypes.func,
  onHide: PropTypes.func,
  onProgressState: PropTypes.func,
  onLoadContent: PropTypes.func,
  onSaveContent: PropTypes.func,
  onBeforeSetContent: PropTypes.func,
  onSetContent: PropTypes.func,
  onBeforeGetContent: PropTypes.func,
  onGetContent: PropTypes.func,
  onVisualAid: PropTypes.func,
  onRemove: PropTypes.func,
  onSubmit: PropTypes.func,
  onReset: PropTypes.func,
  onBeforeAddUndo: PropTypes.func,
  onAddUndo: PropTypes.func,
  onChange: PropTypes.func,
  onUndo: PropTypes.func,
  onRedo: PropTypes.func,
  onClearUndos: PropTypes.func,
  onObjectSelected: PropTypes.func,
  onObjectResizeStart: PropTypes.func,
  onObjectResized: PropTypes.func,
  onPreProcess: PropTypes.func,
  onPostProcess: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onDirty  : PropTypes.func,
};
