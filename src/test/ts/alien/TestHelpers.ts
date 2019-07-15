import { Chain, Assertions } from '@ephox/agar';
import { Cell } from '@ephox/katamari';

const EventState = () => {
  const state: Cell<Record<string, any>> = Cell({});

  const createHandler = (name: string) => {
    return (...args: any[]) => {
      state.set({
        ...state.get(),
        [name]: args
      });
    };
  };

  const get = (name: string) => {
    return state.get()[name];
  };

  const cEach = (name: string, assertState: (args: any[]) => void) => {
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
    get,
    cClearState
  };
};

export {
  EventState
};