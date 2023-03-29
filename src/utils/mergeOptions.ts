import { RequestConfig } from "../interfaces/Request";

export function mergeOptions(source: RequestConfig, target: RequestConfig) {
  return {
    ...source,
    ...target,
    headers: {
      ...source.headers,
      ...target.headers
    },
    mock: {
      ...source.mock,
      ...target.mock
    }
  };
}
