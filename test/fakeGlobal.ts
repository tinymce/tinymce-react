(global as any).tinymce = {init: (x: any) => { return; }};
(global as any).requestAnimationFrame = (callback: any) => {
  setTimeout(callback, 0);
};
