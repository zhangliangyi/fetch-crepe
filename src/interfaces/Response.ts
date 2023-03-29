export interface ParsedResponse<T = any> extends Response {
  data: T;
}

export type MockResponse<T = any> = {
  status: Response["status"];
  data: any;
};
