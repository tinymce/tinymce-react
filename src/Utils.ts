export const bindHandlers = (props: any, editor: any): void => {
  Object.keys(props).forEach((key: string) => {
    const handler = props[key];
    if (typeof handler === 'function') {
      editor.on(key.substring(2), (e: any) => handler(e, editor));
    }
  });
};
