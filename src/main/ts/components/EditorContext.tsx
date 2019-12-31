import * as React from 'react';
import * as ScriptLoader from '../ScriptLoader';
import { noop } from '../Utils';

export type ILoadFn = (doc: Document, callbackFn: ScriptLoader.callbackFn) => void;

export interface IEditorContext {
    load: ILoadFn;
}

export const editorContext = React.createContext<IEditorContext>({ load: noop });

const scriptState = ScriptLoader.create();

export interface IEditorProviderProps {
    apiKey?: string;
    cloudChannel?: string;
    cloud?: boolean;
    packagePath?: string;
    children?: React.ReactNode;
}

const EditorProviderPure: React.FC<IEditorProviderProps> = (
    {
        apiKey = 'no-api-key',
        cloud = true,
        cloudChannel = '5',
        packagePath,
        children,
    }
) => {
    const { Provider } = editorContext;

    const loadFn = React.useMemo(() => {
        return (doc: Document, callbackFn: ScriptLoader.callbackFn) => {
            if (cloud) {
                ScriptLoader.load(scriptState, doc, `https://cdn.tiny.cloud/1/${apiKey}/tinymce/${cloudChannel}/tinymce.min.js`, callbackFn);
            } else if (packagePath) {
                ScriptLoader.load(scriptState, doc, `${packagePath}/tinymce.min.js`, callbackFn);
            }
        };
    }, [apiKey, cloud, cloudChannel, packagePath]);

    const contextValue = React.useMemo(() => ({
        load: loadFn,
    }), [loadFn]);

    return (
        <Provider value={contextValue}>{children}</Provider>
    );
};

export const EditorProvider = React.memo(EditorProviderPure);
