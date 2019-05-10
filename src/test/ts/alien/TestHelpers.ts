import { Chain, Assertions } from '@ephox/agar';

const EventState = () => {
  const state: Record<string, any> = {};

  const handler = (name: string) => {
    return (...args: any[]) => {
      state[name] = args;
    };
  };

  const get = (name: string) => {
    return state[name];
  };

  const cEach = (name: string, doAssert: (args: any[]) => void) => {
    return Chain.fromChains([
      Chain.op(() => Assertions.assertEq(name + ' should exist', true, !!state[name])),
      Chain.op(() => {
        doAssert(state[name]);
      })
    ]);
  };

  return {
    cEach,
    handler,
    get
  };
};

export {
  EventState
};