import { Chain, Assertions } from '@ephox/agar';
import { Cell, Obj } from '@ephox/katamari';
import { EventHandler } from 'src/main/ts/Events';

interface EventHandlerArgs<T> {
  editorEvent: T;
  editor: any;
}

const EventStore = () => {
  const state: Cell<Record<string, EventHandlerArgs<any>[]>> = Cell({});

  const createHandler = <T = any>(name: string): EventHandler<T> => {
    return (event: T, editor: any) => {
      const oldState = state.get();

      const eventHandlerState = Obj.get(oldState, name)
        .getOr([] as EventHandlerArgs<any>[])
        .concat([{ editorEvent: event, editor }]);

      state.set({
        ...oldState,
        [name]: eventHandlerState
      });
    };
  };

  const cEach = (name: string, assertState: (state: EventHandlerArgs<any>[]) => void) => {
    return Chain.fromChains([
      Chain.op(() => {
        Assertions.assertEq('State from "' + name + '" handler should exist', true, name in state.get());
        assertState(state.get()[name]);
      })
    ]);
  };

  const cClearState = Chain.op(() => {
    state.set({});
  });

  return {
    cEach,
    createHandler,
    cClearState
  };
};

export {
  EventStore
};