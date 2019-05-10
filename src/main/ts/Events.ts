/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

export type EventHandler<A> = (a: A, editor?: any) => any;

export interface INativeEvents {
  onBeforePaste: EventHandler<ClipboardEvent>;
  onBlur: EventHandler<FocusEvent>;
  onClick: EventHandler<MouseEvent>;
  onContextMenu: EventHandler<MouseEvent>;
  onCopy: EventHandler<ClipboardEvent>;
  onCut: EventHandler<ClipboardEvent>;
  onDblclick: EventHandler<MouseEvent>;
  onDrag: EventHandler<DragEvent>;
  onDragDrop: EventHandler<DragEvent>;
  onDragEnd: EventHandler<DragEvent>;
  onDragGesture: EventHandler<DragEvent>;
  onDragOver: EventHandler<DragEvent>;
  onDrop: EventHandler<DragEvent>;
  onFocus: EventHandler<FocusEvent>;
  onFocusIn: EventHandler<FocusEvent>;
  onFocusOut: EventHandler<FocusEvent>;
  onKeyDown: EventHandler<KeyboardEvent>;
  onKeyPress: EventHandler<KeyboardEvent>;
  onKeyUp: EventHandler<KeyboardEvent>;
  onMouseDown: EventHandler<MouseEvent>;
  onMouseEnter: EventHandler<MouseEvent>;
  onMouseLeave: EventHandler<MouseEvent>;
  onMouseMove: EventHandler<MouseEvent>;
  onMouseOut: EventHandler<MouseEvent>;
  onMouseOver: EventHandler<MouseEvent>;
  onMouseUp: EventHandler<MouseEvent>;
  onPaste: EventHandler<ClipboardEvent>;
  onSelectionChange: EventHandler<Event>;
}

export interface ITinyEvents {
  onActivate: EventHandler<any>;
  onAddUndo: EventHandler<any>;
  onBeforeAddUndo: EventHandler<any>;
  onBeforeExecCommand: EventHandler<any>;
  onBeforeGetContent: EventHandler<any>;
  onBeforeRenderUI: EventHandler<any>;
  onBeforeSetContent: EventHandler<any>;
  onChange: EventHandler<any>;
  onClearUndos: EventHandler<any>;
  onDeactivate: EventHandler<any>;
  onDirty: EventHandler<any>;
  onExecCommand: EventHandler<any>;
  onGetContent: EventHandler<any>;
  onHide: EventHandler<any>;
  onInit: EventHandler<any>;
  onLoadContent: EventHandler<any>;
  onNodeChange: EventHandler<any>;
  onPostProcess: EventHandler<any>;
  onPostRender: EventHandler<any>;
  onPreProcess: EventHandler<any>;
  onProgressState: EventHandler<any>;
  onRedo: EventHandler<any>;
  onRemove: EventHandler<any>;
  onReset: EventHandler<any>;
  onSaveContent: EventHandler<any>;
  onSetAttrib: EventHandler<any>;
  onObjectResizeStart: EventHandler<any>;
  onObjectResized: EventHandler<any>;
  onObjectSelected: EventHandler<any>;
  onSetContent: EventHandler<any>;
  onShow: EventHandler<any>;
  onSubmit: EventHandler<any>;
  onUndo: EventHandler<any>;
  onVisualAid: EventHandler<any>;
}

export interface IEvents extends INativeEvents, ITinyEvents {}
