/// <reference types="react" />
declare module "main/ts/Events" {
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
    export interface IEvents extends INativeEvents, ITinyEvents {
    }
}
declare module "main/ts/TinyMCE" {
    const getTinymce: () => any;
    export { getTinymce };
}
declare module "main/ts/components/Editor" {
    /**
     * Copyright (c) 2017-present, Ephox, Inc.
     *
     * This source code is licensed under the Apache 2 license found in the
     * LICENSE file in the root directory of this source tree.
     *
     */
    import * as React from 'react';
    import { EventHandler, IEvents } from "main/ts/Events";
    import { IEditorPropTypes } from "main/ts/components/EditorPropTypes";
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
    export interface IAllProps extends Partial<IProps>, Partial<IEvents> {
    }
    export class Editor extends React.Component<IAllProps> {
        static propTypes: IEditorPropTypes;
        static defaultProps: Partial<IAllProps>;
        private element;
        private id?;
        private editor?;
        private inline?;
        private currentContent?;
        componentWillMount(): void;
        componentDidMount(): void;
        componentWillUnmount(): void;
        componentWillReceiveProps(nextProps: Partial<IProps>): void;
        render(): JSX.Element;
        private initialise;
        private initEditor;
        private renderInline;
        private renderIframe;
    }
}
declare module "main/ts/components/EditorPropTypes" {
    /**
     * Copyright (c) 2017-present, Ephox, Inc.
     *
     * This source code is licensed under the Apache 2 license found in the
     * LICENSE file in the root directory of this source tree.
     *
     */
    import * as PropTypes from 'prop-types';
    import { IEvents } from "main/ts/Events";
    import { IProps } from "main/ts/components/Editor";
    export type CopyProps<T> = {
        [P in keyof T]: PropTypes.Requireable<any>;
    };
    export interface IEditorPropTypes extends CopyProps<IEvents>, CopyProps<IProps> {
    }
    export const eventPropTypes: {
        onActivate: PropTypes.Requireable<(...args: any[]) => any>;
        onAddUndo: PropTypes.Requireable<(...args: any[]) => any>;
        onBeforeAddUndo: PropTypes.Requireable<(...args: any[]) => any>;
        onBeforeExecCommand: PropTypes.Requireable<(...args: any[]) => any>;
        onBeforeGetContent: PropTypes.Requireable<(...args: any[]) => any>;
        onBeforeRenderUI: PropTypes.Requireable<(...args: any[]) => any>;
        onBeforeSetContent: PropTypes.Requireable<(...args: any[]) => any>;
        onBeforePaste: PropTypes.Requireable<(...args: any[]) => any>;
        onBlur: PropTypes.Requireable<(...args: any[]) => any>;
        onChange: PropTypes.Requireable<(...args: any[]) => any>;
        onClearUndos: PropTypes.Requireable<(...args: any[]) => any>;
        onClick: PropTypes.Requireable<(...args: any[]) => any>;
        onContextMenu: PropTypes.Requireable<(...args: any[]) => any>;
        onCopy: PropTypes.Requireable<(...args: any[]) => any>;
        onCut: PropTypes.Requireable<(...args: any[]) => any>;
        onDblclick: PropTypes.Requireable<(...args: any[]) => any>;
        onDeactivate: PropTypes.Requireable<(...args: any[]) => any>;
        onDirty: PropTypes.Requireable<(...args: any[]) => any>;
        onDrag: PropTypes.Requireable<(...args: any[]) => any>;
        onDragDrop: PropTypes.Requireable<(...args: any[]) => any>;
        onDragEnd: PropTypes.Requireable<(...args: any[]) => any>;
        onDragGesture: PropTypes.Requireable<(...args: any[]) => any>;
        onDragOver: PropTypes.Requireable<(...args: any[]) => any>;
        onDrop: PropTypes.Requireable<(...args: any[]) => any>;
        onExecCommand: PropTypes.Requireable<(...args: any[]) => any>;
        onFocus: PropTypes.Requireable<(...args: any[]) => any>;
        onFocusIn: PropTypes.Requireable<(...args: any[]) => any>;
        onFocusOut: PropTypes.Requireable<(...args: any[]) => any>;
        onGetContent: PropTypes.Requireable<(...args: any[]) => any>;
        onHide: PropTypes.Requireable<(...args: any[]) => any>;
        onInit: PropTypes.Requireable<(...args: any[]) => any>;
        onKeyDown: PropTypes.Requireable<(...args: any[]) => any>;
        onKeyPress: PropTypes.Requireable<(...args: any[]) => any>;
        onKeyUp: PropTypes.Requireable<(...args: any[]) => any>;
        onLoadContent: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseDown: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseEnter: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseLeave: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseMove: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseOut: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseOver: PropTypes.Requireable<(...args: any[]) => any>;
        onMouseUp: PropTypes.Requireable<(...args: any[]) => any>;
        onNodeChange: PropTypes.Requireable<(...args: any[]) => any>;
        onObjectResizeStart: PropTypes.Requireable<(...args: any[]) => any>;
        onObjectResized: PropTypes.Requireable<(...args: any[]) => any>;
        onObjectSelected: PropTypes.Requireable<(...args: any[]) => any>;
        onPaste: PropTypes.Requireable<(...args: any[]) => any>;
        onPostProcess: PropTypes.Requireable<(...args: any[]) => any>;
        onPostRender: PropTypes.Requireable<(...args: any[]) => any>;
        onPreProcess: PropTypes.Requireable<(...args: any[]) => any>;
        onProgressState: PropTypes.Requireable<(...args: any[]) => any>;
        onRedo: PropTypes.Requireable<(...args: any[]) => any>;
        onRemove: PropTypes.Requireable<(...args: any[]) => any>;
        onReset: PropTypes.Requireable<(...args: any[]) => any>;
        onSaveContent: PropTypes.Requireable<(...args: any[]) => any>;
        onSelectionChange: PropTypes.Requireable<(...args: any[]) => any>;
        onSetAttrib: PropTypes.Requireable<(...args: any[]) => any>;
        onSetContent: PropTypes.Requireable<(...args: any[]) => any>;
        onShow: PropTypes.Requireable<(...args: any[]) => any>;
        onSubmit: PropTypes.Requireable<(...args: any[]) => any>;
        onUndo: PropTypes.Requireable<(...args: any[]) => any>;
        onVisualAid: PropTypes.Requireable<(...args: any[]) => any>;
    };
    export const EditorPropTypes: IEditorPropTypes;
}
declare module "main/ts/Utils" {
    export const isFunction: (x: any) => x is Function;
    export const bindHandlers: (props: any, editor: any, initEvent: Event) => void;
    export const uuid: (prefix: string) => string;
    export const isTextarea: (element: Element | null) => element is HTMLTextAreaElement;
    export const mergePlugins: (initPlugins: string | string[], inputPlugins?: string | string[] | undefined) => string[];
}
declare module "main/ts/ScriptLoader" {
    export type callbackFn = () => void;
    export interface IStateObj {
        listeners: callbackFn[];
        scriptId: string;
        scriptLoaded: boolean;
    }
    export const create: () => IStateObj;
    export const load: (state: IStateObj, doc: Document, url: string, callback: callbackFn) => void;
}
declare module "main/ts/index" {
    /**
     * Copyright (c) 2017-present, Ephox, Inc.
     *
     * This source code is licensed under the Apache 2 license found in the
     * LICENSE file in the root directory of this source tree.
     *
     */
    import { Editor, IAllProps } from "main/ts/components/Editor";
    export { Editor, IAllProps };
}
declare module "test/ts/alien/Loader" {
    import { Chain } from '@ephox/agar';
    import * as React from 'react';
    import { Editor, IAllProps } from "main/ts/components/Editor";
    import 'tinymce/tinymce';
    export interface Payload {
        DOMNode: Element;
        editor: any;
        ref: React.RefObject<Editor>;
        root: HTMLElement;
    }
    type TestEditor = (props: IAllProps) => JSX.Element;
    const cSetup: (createElement: (Ed: TestEditor) => JSX.Element) => Chain<Payload, Payload>;
    const cRemove: Chain<Payload, Payload>;
    const cNamedChainDirect: (name: "ref" | "DOMNode" | "editor" | "root") => Chain<Record<string, any>, Record<string, any>>;
    const cDOMNode: (chain: Chain<any, any>) => Chain<{}, any>;
    const cEditor: (chain: Chain<any, any>) => Chain<{}, any>;
    export { cSetup, cRemove, cNamedChainDirect, cDOMNode, cEditor };
}
declare module "test/ts/alien/TestHelpers" {
    import { Chain } from '@ephox/agar';
    const EventState: () => {
        cEach: (name: string, doAssert: (args: any[]) => void) => Chain<any, any>;
        handler: (name: string) => (...args: any[]) => void;
        get: (name: string) => any;
    };
    export { EventState };
}
declare module "test/ts/browser/EditorBehaviorTest" { }
declare module "test/ts/browser/EditorInitTest" { }
