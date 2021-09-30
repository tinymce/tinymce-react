/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import * as PropTypes from 'prop-types';
import { IEvents } from '../Events';
import { IProps } from './Editor';
export declare type CopyProps<T> = {
    [P in keyof T]: PropTypes.Requireable<unknown>;
};
export declare type IEventPropTypes = CopyProps<IEvents>;
export interface IEditorPropTypes extends IEventPropTypes, CopyProps<IProps> {
}
export declare const eventPropTypes: IEventPropTypes;
export declare const EditorPropTypes: IEditorPropTypes;
