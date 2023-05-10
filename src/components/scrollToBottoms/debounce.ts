function debounce(fn: any, ms: any) {
  if (!ms) {
    return fn;
  }

  let last = 0;
  let timeout: any = null;

  return (...args: any) => {
    const now = Date.now();

    if (now - last > ms) {
      fn(...args);
      last = now;
    } else {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        fn(...args);
        last = Date.now();
      }, Math.max(0, ms - now + last));
    }
  };
}

export default debounce;
