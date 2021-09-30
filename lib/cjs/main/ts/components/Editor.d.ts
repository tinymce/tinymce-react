/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as React from 'react';
import { IEvents } from '../Events';
import { IEditorPropTypes } from './EditorPropTypes';
import { Editor as TinyMCEEditor, RawEditorSettings } from 'tinymce';
export interface IProps {
    apiKey: string;
    id: string;
    inline: boolean;
    initialValue: string;
    onEditorChange: (a: string, editor: TinyMCEEditor) => void;
    value: string;
    init: RawEditorSettings & {
        selector?: undefined;
        target?: undefined;
    };
    /** @deprecated use `editor.getContent({format: 'text' })` in `onEditorChange` prop instead */
    outputFormat: 'html' | 'text';
    tagName: string;
    cloudChannel: string;
    plugins: NonNullable<RawEditorSettings['plugins']>;
    toolbar: NonNullable<RawEditorSettings['toolbar']>;
    disabled: boolean;
    textareaName: string;
    tinymceScriptSrc: string;
    scriptLoading: {
        async?: boolean;
        defer?: boolean;
        delay?: number;
    };
}
export interface IAllProps extends Partial<IProps>, Partial<IEvents> {
}
export declare class Editor extends React.Component<IAllProps> {
    static propTypes: IEditorPropTypes;
    static defaultProps: Partial<IAllProps>;
    editor?: TinyMCEEditor;
    private id;
    private elementRef;
    private inline;
    private currentContent?;
    private boundHandlers;
    private rollbackTimer;
    private valueCursor;
    constructor(props: Partial<IAllProps>);
    componentDidUpdate(prevProps: Partial<IAllProps>): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): React.ReactElement<{
        ref: React.RefObject<HTMLElement>;
        id: string;
    }, string | React.JSXElementConstructor<any>>;
    private renderInline;
    private renderIframe;
    private getScriptSrc;
    private getInitialValue;
    private bindHandlers;
    private rollbackChange;
    private handleBeforeInput;
    private handleBeforeInputSpecial;
    private handleEditorChange;
    private handleEditorChangeSpecial;
    private initialise;
}
