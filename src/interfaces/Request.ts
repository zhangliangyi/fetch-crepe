import { Mock } from "./Mock";

export interface FetchOptions {
  url?: string;
  method?: RequestInit["method"];
  mode?: RequestInit["mode"];
  cache?: RequestInit["cache"];
  credentials?: RequestInit["credentials"];
  body?: RequestInit["body"];
  referrer?: RequestInit["referrer"];
  referrerPolicy?: RequestInit["referrerPolicy"];
  headers?: RequestInit["headers"];
  signal?: RequestInit["signal"];
}

export interface RequestConfig extends FetchOptions {
  baseURL?: string;
  mock?: Mock;
  timeout?: number;
  timeoutId?: number;
  useMock?: boolean;
}
