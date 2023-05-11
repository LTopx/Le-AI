// Array.at polyfill
function at(n) {
  // ToInteger() abstract op
  n = Math.trunc(n) || 0;
  // Allow negative indexing from the end
  if (n < 0) n += this.length;
  // OOB access is guaranteed to return undefined
  if (n < 0 || n >= this.length) return undefined;
  // Otherwise, this is just normal property access
  return this[n];
}

if (![].at) {
  const TypedArray = Reflect.getPrototypeOf(Int8Array);
  for (const C of [Array, String, TypedArray]) {
    Object.defineProperty(C.prototype, "at", {
      value: at,
      writable: true,
      enumerable: false,
      configurable: true,
    });
  }
}

// Array.findLastIndex polyfill
if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function (callback, thisArg) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (callback.call(thisArg, this[i], i, this)) return i;
    }
    return -1;
  };
}
