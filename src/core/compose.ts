import { ComposedMiddleware, Middleware, Next } from "../interfaces/Middleware";

export function compose<T>(middleware: Middleware<T>[]): ComposedMiddleware<T> {
  if (!Array.isArray(middleware)) throw new TypeError("Middleware stack must be an array!");
  for (const fn of middleware) {
    if (typeof fn !== "function") throw new TypeError("Middleware must be composed of functions!");
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context: T, next?: Next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i: number): Promise<void> {
      if (i <= index) return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn: Next | undefined = middleware[i] as Next;
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve((fn as Middleware<T>)(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
