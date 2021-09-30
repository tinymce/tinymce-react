/**
 * Copyright (c) 2017-present, Ephox, Inc.
 *
 * This source code is licensed under the Apache 2 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
export declare type callbackFn = () => void;
export interface IStateObj {
    listeners: callbackFn[];
    scriptId: string;
    scriptLoading: boolean;
    scriptLoaded: boolean;
}
interface ScriptLoader {
    load: (doc: Document, url: string, async: boolean, defer: boolean, delay: number, callback: callbackFn) => void;
    reinitialize: () => void;
}
declare const ScriptLoader: ScriptLoader;
export { ScriptLoader };
