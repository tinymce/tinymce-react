import { Assert, UnitTest } from '@ephox/bedrock-client';
import { EditorEvent, Editor as TinyMCEEditor } from 'tinymce';
import { bindHandlers2 } from '../../../main/ts/Utils';

type ReactHandler = (event: EditorEvent<unknown>, editor: TinyMCEEditor) => unknown;
type Handler = { wrapped: ReactHandler; };

UnitTest.test('Event binding test', () =>  {
  let calls: {type: 'on' | 'off', name: string, handler: Handler}[];
  let boundHandlers: Record<string, Handler>;

  const check = (offHandlers: Record<string, ReactHandler>, onHandlers: Record<string, ReactHandler>, activeHandlers: Record<string, ReactHandler>) => {
    const offCount = Object.keys(offHandlers).length;
    const onCount = Object.keys(onHandlers).length;
    Assert.eq('Expected number of calls to be sum of handlers removed and handlers added', offCount + onCount, calls.length);
    let i: number;
    for (i = 0; i < offCount; i++) {
      const value = calls[i];
      Assert.eq('Call type did not match expected', 'off', value.type);
      Assert.eq('Handler did not match expected', offHandlers[value.name], value.handler.wrapped);
    }
    for (; i < calls.length; i++) {
      const value = calls[i];
      Assert.eq('Call type did not match expected', 'on', value.type);
      Assert.eq('Handler did not match expected', onHandlers[value.name], value.handler.wrapped);
    }
    Assert.eq('Bound handlers did not match expected', Object.keys(activeHandlers).length, Object.keys(boundHandlers).length);
    
  }

  const on = (name: string, handler: Handler, prepend?: boolean) => calls.push({type: 'on', name, handler});
  const off = (name: string, handler: Handler) => calls.push({type: 'off', name, handler});
  const adapter = (wrapped: ReactHandler): Handler => ({wrapped});
  
  // dummy functions for handlers
  const focusHandler = () => {};
  const blurHandler = () => {};

  // check no handlers
  calls = [];
  boundHandlers = {};
  bindHandlers2(on, off, adapter, {}, {}, boundHandlers);
  check({}, {}, {});


  // check adding handlers
  // nothing should be removed and the focus and blur handler should be added
  calls = [];
  boundHandlers = {};
  bindHandlers2(on, off, adapter, {}, {onFocus: focusHandler, onBlur: blurHandler}, boundHandlers);
  check({}, {'Focus': focusHandler, 'Blur': blurHandler}, {'Focus': focusHandler, 'Blur': blurHandler});

  // check changing an unrelated property while keeping handlers the same
  // nothing should be added or removed and the bound handlers should stay the same
  calls = [];
  boundHandlers = {'Focus': adapter(focusHandler), 'Blur': adapter(blurHandler)};
  bindHandlers2(on, off, adapter, {onFocus: focusHandler, onBlur: blurHandler, disabled: true}, {onFocus: focusHandler, onBlur: blurHandler, disabled: false}, boundHandlers);
  check({}, {}, {'Focus': focusHandler, 'Blur': blurHandler});

  // check removing a handler for Blur while keeping the Focus handler
  // the blur handler should be removed and the focus handler should remain afterwards
  calls = [];
  boundHandlers = {'Focus': adapter(focusHandler), 'Blur': adapter(blurHandler)};
  bindHandlers2(on, off, adapter, {onFocus: focusHandler, onBlur: blurHandler}, {onFocus: focusHandler}, boundHandlers);
  check({'Blur': blurHandler}, {}, {'Focus': focusHandler});


});