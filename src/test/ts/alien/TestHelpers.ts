import { Assertions } from '@ephox/agar';
import { Cell, Obj } from '@ephox/katamari';
import { Version } from 'src/main/ts/components/Editor';
import { Editor as TinyMCEEditor } from 'tinymce';

interface EventHandlerArgs<T> {
  editorEvent: T;
  editor: TinyMCEEditor;
}

type HandlerType<A> = (a: A, editor: TinyMCEEditor) => unknown;

const VERSIONS: Version[] = [ '4', '5', '6', '7' ];
const CLOUD_VERSIONS: Version[] = [ '5', '6', '7' ];

const VALID_API_KEY = 'qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc';

const EventStore = () => {
  const state: Cell<Record<string, EventHandlerArgs<unknown>[]>> = Cell({});

  const createHandler = <T>(name: string): HandlerType<T> => (event: T, editor) => {
    const oldState = state.get();

    const eventHandlerState = Obj.get(oldState, name)
      .getOr([] as EventHandlerArgs<unknown>[])
      .concat([{ editorEvent: event, editor }]);

    state.set({
      ...oldState,
      [name]: eventHandlerState
    });
  };

  const each = <T>(name: string, assertState: (state: EventHandlerArgs<T>[]) => void) => {
    Assertions.assertEq('State from "' + name + '" handler should exist', true, name in state.get());
    assertState(state.get()[name] as unknown as EventHandlerArgs<T>[]);
  };

  const clearState = () => {
    state.set({});
  };

  return {
    each,
    createHandler,
    clearState
  };
};

export {
  VALID_API_KEY,
  EventStore,
  VERSIONS,
  CLOUD_VERSIONS,
  Version
};