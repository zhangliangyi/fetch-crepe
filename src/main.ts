import { RequestConfig } from "./interfaces/Request";
import RequestCore from "./core/RequestCore";

export function createInstance(config?: RequestConfig) {
  return new RequestCore(config);
}

export function makeRequest(config: RequestConfig): Promise<unknown> {
  return createInstance().request(config);
}

const request = createInstance();
export default request;
