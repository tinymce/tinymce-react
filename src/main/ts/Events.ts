import { Editor as TinyMCEEditor, EditorEvent, Events } from 'tinymce';

export type EventHandler<A> = (a: EditorEvent<A>, editor: TinyMCEEditor) => unknown;

type EEventHandler<K extends keyof Events.EditorEventMap> = EventHandler<Events.EditorEventMap[K]>;

export interface INativeEvents {
  onBeforePaste: EEventHandler<'beforepaste'>;
  onBlur: EEventHandler<'blur'>;
  onClick: EEventHandler<'click'>;
  onCompositionEnd: EEventHandler<'compositionend'>;
  onCompositionStart: EEventHandler<'compositionstart'>;
  onCompositionUpdate: EEventHandler<'compositionupdate'>;
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
  onInput: EEventHandler<'input'>;
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
  onCommentChange: EventHandler<unknown>;
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
  onSkinLoadError: EEventHandler<'SkinLoadError'>;
  onThemeLoadError: EEventHandler<'ThemeLoadError'>;
  onModelLoadError: EEventHandler<'ModelLoadError'>;
  onPluginLoadError: EEventHandler<'PluginLoadError'>;
  onIconsLoadError: EEventHandler<'IconsLoadError'>;
  onLanguageLoadError: EEventHandler<'LanguageLoadError'>;
  onScriptsLoad: () => void;
  onScriptsLoadError: (err: unknown) => void;
}

export interface IEvents extends INativeEvents, ITinyEvents {}
