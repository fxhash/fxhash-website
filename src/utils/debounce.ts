export const debounce = (func: any, wait: number, immediate?: boolean) => {
  let timeout: NodeJS.Timeout | null;
  return function debounceFunc(this: any) {
    const context = this;
    const args = arguments;
    clearTimeout(timeout!);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
};
