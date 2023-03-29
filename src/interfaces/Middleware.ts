import { RequestConfig } from "./Request";
import { MockResponse, ParsedResponse } from "./Response";

export type Context = { req: RequestConfig; res?: Response | ParsedResponse | MockResponse };
export type Next = () => Promise<any>;
export type Middleware<T> = (context: T, next: Next) => any;
export type ComposedMiddleware<T> = (context: T, next?: Next) => Promise<void>;
