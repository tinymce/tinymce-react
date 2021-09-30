/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Editor as TinyMCEEditor, EditorEvent, Events } from 'tinymce';
export declare type EventHandler<A> = (a: EditorEvent<A>, editor: TinyMCEEditor) => unknown;
declare type EEventHandler<K extends keyof Events.EditorEventMap> = EventHandler<Events.EditorEventMap[K]>;
export interface INativeEvents {
    onBeforePaste: EEventHandler<'beforepaste'>;
    onBlur: EEventHandler<'blur'>;
    onClick: EEventHandler<'click'>;
    onContextMenu: EEventHandler<'contextmenu'>;
    onCopy: EEventHandler<'copy'>;
    onCut: EEventHandler<'cut'>;
    onDblclick: EEventHandler<'dblclick'>;
    onDrag: EEventHandler<'drag'>;
    onDragDrop: EEventHandler<'dragdrop'>;
    onDragEnd: EEventHandler<'dragend'>;
    onDragGesture: EEventHandler<'draggesture'>;
    onDragOver: EEventHandler<'dragover'>;
    onDrop: EEventHandler<'drop'>;
    onFocus: EEventHandler<'focus'>;
    onFocusIn: EEventHandler<'focusin'>;
    onFocusOut: EEventHandler<'focusout'>;
    onKeyDown: EEventHandler<'keydown'>;
    onKeyPress: EEventHandler<'keypress'>;
    onKeyUp: EEventHandler<'keyup'>;
    onMouseDown: EEventHandler<'mousedown'>;
    onMouseEnter: EEventHandler<'mouseenter'>;
    onMouseLeave: EEventHandler<'mouseleave'>;
    onMouseMove: EEventHandler<'mousemove'>;
    onMouseOut: EEventHandler<'mouseout'>;
    onMouseOver: EEventHandler<'mouseover'>;
    onMouseUp: EEventHandler<'mouseup'>;
    onPaste: EEventHandler<'paste'>;
    onSelectionChange: EEventHandler<'selectionchange'>;
}
export interface ITinyEvents {
    onActivate: EEventHandler<'activate'>;
    onAddUndo: EEventHandler<'AddUndo'>;
    onBeforeAddUndo: EEventHandler<'BeforeAddUndo'>;
    onBeforeExecCommand: EEventHandler<'BeforeExecCommand'>;
    onBeforeGetContent: EEventHandler<'BeforeGetContent'>;
    onBeforeRenderUI: EventHandler<unknown>;
    onBeforeSetContent: EEventHandler<'BeforeSetContent'>;
    onChange: EventHandler<unknown>;
    onClearUndos: EEventHandler<'ClearUndos'>;
    onDeactivate: EEventHandler<'deactivate'>;
    onDirty: EventHandler<unknown>;
    onExecCommand: EEventHandler<'ExecCommand'>;
    onGetContent: EEventHandler<'GetContent'>;
    onHide: EventHandler<unknown>;
    onInit: EEventHandler<'init'>;
    onLoadContent: EEventHandler<'LoadContent'>;
    onNodeChange: EEventHandler<'NodeChange'>;
    onPostProcess: EventHandler<unknown>;
    onPostRender: EEventHandler<'PostRender'>;
    onPreProcess: EventHandler<unknown>;
    onProgressState: EEventHandler<'ProgressState'>;
    onRedo: EEventHandler<'Redo'>;
    onRemove: EEventHandler<'remove'>;
    onReset: EventHandler<unknown>;
    onSaveContent: EventHandler<unknown>;
    onSetAttrib: EventHandler<unknown>;
    onObjectResizeStart: EEventHandler<'ObjectResizeStart'>;
    onObjectResized: EEventHandler<'ObjectResized'>;
    onObjectSelected: EEventHandler<'ObjectSelected'>;
    onSetContent: EEventHandler<'SetContent'>;
    onShow: EventHandler<unknown>;
    onSubmit: EventHandler<unknown>;
    onUndo: EEventHandler<'Undo'>;
    onVisualAid: EventHandler<unknown>;
}
export interface IEvents extends INativeEvents, ITinyEvents {
}
export {};
