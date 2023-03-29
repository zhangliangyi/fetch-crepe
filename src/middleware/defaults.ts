import { RequestConfig } from "../interfaces/Request";
import { Context, Next } from "../interfaces/Middleware";
import { mergeOptions } from "../utils/mergeOptions";

const defaults: RequestConfig = {
  baseURL: "",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  mock: {
    baseURL: "",
    delay: 0,
  },
  timeout: 0,
  useMock: false
};

async function setDefaults(context: Context, next: Next) {
  const { req } = context;
  context.req = mergeOptions(defaults, req) as RequestConfig;

  await next();
}

export default setDefaults;
