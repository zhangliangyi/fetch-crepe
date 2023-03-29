import { Context, Next } from "../interfaces/Middleware";

async function abort(context: Context, next: Next) {
  const { req } = context;
  const { signal, timeout = 0 } = req;

  if (signal || timeout > 0) {
    const abortController = new AbortController();
    signal && (signal.onabort = () => abortController.abort());
    timeout > 0 && (req.timeoutId = window.setTimeout(() => abortController.abort(), timeout));
    req.signal = abortController.signal;
  }
  await next();
}

export default abort;
