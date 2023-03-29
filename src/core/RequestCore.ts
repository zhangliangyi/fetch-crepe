import { compose } from "./compose";
import { abort, fetchData, setDefaults, parseResponse } from "../middleware";
import { RequestConfig } from "../interfaces/Request";
import { Context, Middleware } from "../interfaces/Middleware";
import { MockResponse, ParsedResponse } from "../interfaces/Response";
import parseError from "./error";
import { mergeOptions } from "../utils/mergeOptions";

class RequestCore {
  config: RequestConfig;
  middleware: Middleware<Context>[] = [parseResponse, setDefaults, abort, fetchData];

  constructor(config: RequestConfig = {}) {
    this.config = config;
  }

  async request(requestConfig: RequestConfig): Promise<ParsedResponse | MockResponse> {
    try {
      const execute = compose<Context>(this.middleware);
      const context: Context = { req: mergeOptions(this.config, requestConfig) };
      await execute(context);
      return context?.res as ParsedResponse | MockResponse;
    } catch (reason) {
      throw await parseError(reason);
    }
  }

  async get(url: string, config?: Omit<RequestConfig, "url">) {
    return this.request({ ...config, url, method: "GET" });
  }

  async post(url: string, config?: Omit<RequestConfig, "url">) {
    return this.request({ ...config, url, method: "POST" });
  }

  async delete(url: string, config?: Omit<RequestConfig, "url">) {
    return this.request({ ...config, url, method: "DELETE" });
  }

  async patch(url: string, config?: Omit<RequestConfig, "url">) {
    return this.request({ ...config, url, method: "PATCH" });
  }

  async put(url: string, config?: Omit<RequestConfig, "url">) {
    return this.request({ ...config, url, method: "PUT" });
  }

  use(fn: Middleware<Context>) {
    const fetchMiddleware = this.middleware.pop();
    this.middleware.push(fn);
    this.middleware.push(fetchMiddleware as Middleware<Context>);
  }
}

export default RequestCore;
