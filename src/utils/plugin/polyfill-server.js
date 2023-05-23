console.log(globalThis, "globalThis");

// if (typeof globalThis !== "object") {
//   Object.defineProperty(Object.prototype, "_T_", {
//     configurable: true,
//     get: function get() {
//       // Still fallback to self. iOS 12.1.4 Safari have `this` of `Object.prototype` being undefined.
//       var global = this || self;
//       global.globalThis = global;
//       delete Object.prototype._T_;
//     },
//   });
//   _T_;
// }

if (typeof globalThis === "undefined") {
  var globalThis = Function("return this")();
}
