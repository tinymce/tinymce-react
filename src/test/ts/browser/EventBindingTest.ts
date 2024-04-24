import { Assert, describe } from '@ephox/bedrock-client';
import { Arr, Obj, Fun } from '@ephox/katamari';
import { IAllProps } from 'src/main/ts/components/Editor';
import { configHandlers2 } from '../../../main/ts/Utils';

interface Handler {
  key: string;
}

describe('EventBindingTest', () => {
  let calls: { type: 'on' | 'off'; name: string; handler: Handler }[];
  let boundHandlers: Record<string, Handler>;

  const check = (handlers: Record<string, 'off' | 'on'>, activeHandlers: string[]) => {
    const onHandlers = Obj.keys(Obj.filter(handlers, (value) => value === 'on'));
    const offHandlers = Obj.keys(Obj.filter(handlers, (value) => value === 'off'));
    Assert.eq('Expected number of calls to be sum of handlers removed and handlers added', onHandlers.length + offHandlers.length, calls.length);
    let i: number;
    for (i = 0; i < offHandlers.length; i++) {
      const value = calls[i];
      Assert.eq('Call type did not match expected', 'off', value.type);
      Assert.eq('Handler did not match expected', handlers[value.name], 'off');
    }
    for (; i < calls.length; i++) {
      const value = calls[i];
      Assert.eq('Call type did not match expected', 'on', value.type);
      Assert.eq('Handler did not match expected', handlers[value.name], 'on');
    }
    Assert.eq('Bound handlers did not match expected', activeHandlers.length, Object.keys(boundHandlers).length);
    Obj.each(boundHandlers, (boundHandler) => {
      Assert.eq('Expected bound handler to be active', true, Arr.contains(activeHandlers, boundHandler.key));
    });
  };

  const on = (name: string, handler: Handler, _prepend?: boolean) => calls.push({ type: 'on', name, handler });
  const off = (name: string, handler: Handler) => calls.push({ type: 'off', name, handler });
  const adapter = (lookup: typeof dummyLookupProp, key: string): Handler => ({ key });
  const dummyLookupProp: any = <K extends keyof IAllProps>(_key: K) => Fun.die('not implemented');

  // dummy functions for handlers
  const focusHandler = Fun.noop;
  const blurHandler = Fun.noop;

  // check no handlers
  calls = [];
  boundHandlers = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  configHandlers2(dummyLookupProp, on, off, adapter, {}, {}, boundHandlers);
  check({}, []);

  // check adding handlers
  // nothing should be removed and the focus and blur handler should be added
  calls = [];
  boundHandlers = {};
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  configHandlers2(dummyLookupProp, on, off, adapter, {}, { onFocus: focusHandler, onBlur: blurHandler }, boundHandlers);
  check({ Focus: 'on', Blur: 'on' }, [ 'onFocus', 'onBlur' ]);

  // check changing an unrelated property while keeping handlers the same
  // nothing should be added or removed and the bound handlers should stay the same
  calls = [];
  boundHandlers = { Focus: adapter(focusHandler, 'onFocus'), Blur: adapter(blurHandler, 'onBlur') };
  configHandlers2(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    dummyLookupProp,
    on,
    off,
    adapter,
    { onFocus: focusHandler, onBlur: blurHandler, disabled: true },
    { onFocus: focusHandler, onBlur: blurHandler, disabled: false },
    boundHandlers
  );
  check({}, [ 'onFocus', 'onBlur' ]);

  // check removing a handler for Blur while keeping the Focus handler
  // the blur handler should be removed and the focus handler should remain afterwards
  calls = [];
  boundHandlers = { Focus: adapter(focusHandler, 'onFocus'), Blur: adapter(blurHandler, 'onBlur') };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  configHandlers2(dummyLookupProp, on, off, adapter, { onFocus: focusHandler, onBlur: blurHandler }, { onFocus: focusHandler }, boundHandlers);
  check({ Blur: 'off' }, [ 'onFocus' ]);
});
