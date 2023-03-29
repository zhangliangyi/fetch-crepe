import { appendUrl } from "../utils/urlHelper";
import { RequestConfig } from "../interfaces/Request";
import { MockResponse } from "../interfaces/Response";

export async function fetchMock(url: string, config: RequestConfig): Promise<MockResponse | Response> {
  const { mock } = config;
  const { baseURL, delay, url: mockUrl, value } = mock || {};

  if (typeof delay === "number" && delay > 0) {
    await new Promise((resolve) => {
      setTimeout(resolve, delay);
    });
  }

  // mock value has higher priority than url
  if (typeof value === "function") {
    const customizeMockData = await value(config);
    // give the customizeMockData more flexible. fallback mechanism here.
    if (customizeMockData !== undefined) {
      return { status: 200, data: customizeMockData };
    }
  }

  if (value instanceof Error) {
    throw value;
  }

  if (mockUrl) {
    // Make a request to the url, but on the mockBaseURL
    return window.fetch(appendUrl(baseURL, mockUrl));
  }

  return { status: 200, data: value || null };
}

export function shouldMock(config: RequestConfig): boolean {
  const { mock, useMock } = config;
  if (useMock && mock) {
    const { url, value } = mock;
    return !!(url || value !== undefined);
  }
  return false;
}
