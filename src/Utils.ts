export const bindHandlers = (props: any, editor: any): void => {
  Object.keys(props).forEach((key: string) => {
    const handler = props[key];
    if (typeof handler === 'function') {
      editor.on(key.substring(2), (e: any) => handler(e, editor));
    }
  });
};

let unique = 0;

export const uuid = (prefix: string): string => {
  const date   = new Date();
  const time   = date.getTime();
  const random = Math.floor(Math.random() * 1000000000);

  unique++;

  return prefix + '_' + random + unique + String(time);
};
