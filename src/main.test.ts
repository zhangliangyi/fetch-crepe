import request, { createInstance, makeRequest } from "./main";
import fetchMock from "jest-fetch-mock";
import { Middleware } from "./interfaces/Middleware";
import { MockResponse, ParsedResponse } from "./interfaces/Response";

describe("request", () => {
  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  afterAll(() => {
    fetchMock.disableMocks();
  });

  it("should send request with correct url", async () => {
    fetchMock.mockOnce(async (req) => {
      expect(req.method).toBe("GET");
      expect(req.url).toBe("/test");
      return {
        headers: {
          "Content-Type": "application/json"
        },
        ok: true,
        status: 200,
        body: JSON.stringify({ data: "success" })
      };
    });

    await makeRequest({
      method: "GET",
      url: "/test"
    });
  });

  it("should call get alias correctly", async () => {
    fetchMock.mockOnce(async (req) => {
      expect(req.method).toBe("GET");
      expect(req.url).toBe("/testGet");
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });
    await request.get("/testGet");
  });

  it("should call post alias correctly", async () => {
    fetchMock.mockOnce(async (req) => {
      expect(req.method).toBe("POST");
      expect(req.url).toBe("/testPost");
      expect(req.body?.toString()).toBe(JSON.stringify({ foo: "bar" }));
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });
    await request.post("/testPost", {
      body: JSON.stringify({ foo: "bar" })
    });
  });

  it("should call put alias correctly", async () => {
    fetchMock.mockOnce(async (req) => {
      expect(req.method).toBe("PUT");
      expect(req.url).toBe("/testPut");
      expect(req.body?.toString()).toBe(JSON.stringify({ foo: "bar" }));
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });

    await request.put("/testPut", {
      body: JSON.stringify({ foo: "bar" })
    });
  });

  it("should call patch alias correctly", async () => {
    fetchMock.mockOnce(async (req) => {
      expect(req.method).toBe("PATCH");
      expect(req.url).toBe("/testPatch");
      expect(req.body?.toString()).toBe(JSON.stringify({ foo: "bar" }));
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });

    await request.patch("/testPatch", {
      body: JSON.stringify({ foo: "bar" })
    });
  });

  it("should call delete alias correctly", async () => {
    fetchMock.mockOnce(async (req) => {
      expect(req.method).toBe("DELETE");
      expect(req.url).toBe("/testDelete");
      expect(req.body?.toString()).toBe(JSON.stringify({ id: 1 }));
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });

    await request.delete("/testDelete", {
      body: JSON.stringify({ id: 1 })
    });
  });

  it("should abort request automatically", async () => {
    // eslint-disable-next-line no-magic-numbers
    fetchMock.mockResponse(() => new Promise((resolve) => setTimeout(() => resolve({ body: "ok" }), 200)));

    // eslint-disable-next-line no-magic-numbers
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 150));
    const makeRequestPromise = makeRequest({ url: "testAbort", timeout: 100 });
    await expect(makeRequestPromise).rejects.toBeTruthy();
  });

  it("should abort request manually", async () => {
    // eslint-disable-next-line no-magic-numbers
    fetchMock.mockResponse(() => new Promise((resolve) => setTimeout(() => resolve({ body: "ok" }), 100)));
    const abortController = new AbortController();

    setTimeout(function () {
      abortController.abort();
    }, 10); // eslint-disable-line no-magic-numbers

    const makeRequestPromise = makeRequest({ url: "testAbort", signal: abortController.signal });
    await expect(makeRequestPromise).rejects.toBeTruthy();
  });

  it("should send mock request correctly", async () => {
    // Mock - Value type
    expect(
      (
        (await makeRequest({
          url: "testMock",
          useMock: true,
          mock: {
            value: "mock data"
          }
        })) as MockResponse
      ).data
    ).toBe("mock data");

    // Mock - Function type
    expect(
      (
        (await makeRequest({
          url: "testMock",
          useMock: true,
          mock: {
            value: () => "mock data"
          }
        })) as MockResponse
      ).data
    ).toBe("mock data");

    // Mock - Url
    fetchMock.mockOnce(async (req) => {
      expect(req.method).toBe("GET");
      expect(req.url).toBe("mockUrl");
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });

    await makeRequest({
      url: "realUrl",
      useMock: true,
      mock: {
        url: "mockUrl"
      }
    });

    // Mock - Error
    const makeRequestPromise = makeRequest({
      url: "realUrl",
      useMock: true,
      mock: {
        value: new Error("error message")
      }
    });
    await expect(makeRequestPromise).rejects.toBeTruthy();
  });

  it("can delay mock request", async () => {
    jest.useFakeTimers();
    const spyTimeout = jest.spyOn(window, "setTimeout");
    const delay = 10;
    makeRequest({
      url: "realUrl",
      useMock: true,
      mock: {
        value: "mock data",
        delay
      }
    });
    jest.runAllTimers();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), delay);
    spyTimeout.mockRestore();
  });

  it("should apply default settings correctly", async () => {
    const instance = createInstance({ baseURL: "/odatav4/" });
    fetchMock.doMock(async (req) => {
      expect(req.url).toBe("/odatav4/testUrl");
      expect(req.headers.get("Accept")).toBe("application/json");
      expect(req.headers.get("Content-Type")).toBe("application/json");
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });
    await instance.get("testUrl");
    await instance.get("/testUrl");
    await instance.get("./testUrl");
    await instance.get("odatav4/testUrl");
    await instance.get("/odatav4/testUrl");
  });

  it("should fetch with absolute url correctly", async () => {
    const instance = createInstance({ baseURL: "/odatav4/" });
    fetchMock.mockOnce(async (req) => {
      expect(req.url).toBe("https://www.sap.com/");
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });
    await instance.get("https://www.sap.com/");
  });

  it("should fetch with baseURL if url is not provided", async () => {
    const instance = createInstance({ baseURL: "/odatav4/" });
    fetchMock.mockOnce(async (req) => {
      expect(req.url).toBe("/odatav4/");
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });
    await instance.get("");
  });

  it("should throw error correctly", async () => {
    let error: { code: number; message: string; details?: Array<unknown> } = {
      code: 500,
      message: "msg",
      details: [
        {
          message: "detail"
        }
      ]
    };
    fetchMock.mockResponseOnce(
      () => new Promise((resolve) => resolve({ status: 500, body: JSON.stringify({ error }) }))
    );
    await expect(makeRequest({ url: "testError" })).rejects.toMatchObject({
      name: "Error",
      ...error
    });

    fetchMock.mockResponseOnce(
      () =>
        new Promise((resolve) => resolve({ status: 404, statusText: "Not Found", body: JSON.stringify({ error: {} }) }))
    );
    await expect(makeRequest({ url: "testError" })).rejects.toMatchObject({
      name: "Error",
      code: 404,
      message: "Not Found",
      details: null
    });

    fetchMock.mockResponseOnce(
      () => new Promise((resolve) => resolve({ status: 404, statusText: "Not Found", body: JSON.stringify({}) }))
    );
    await expect(makeRequest({ url: "testError" })).rejects.toMatchObject({
      name: "Error",
      code: 404,
      message: "Not Found",
      details: null
    });

    // eslint-disable-next-line require-atomic-updates
    error = {
      code: 500,
      message: "Failed to fetch"
    };
    fetchMock.mockRejectOnce(new Error("Failed to fetch"));
    await expect(makeRequest({ url: "testError" })).rejects.toMatchObject({
      name: "NetworkError",
      message: "Failed to fetch"
    });
  });

  it("should return empty value when status is 204", async () => {
    fetchMock.mockOnce(async () => {
      return {
        headers: {
          "Content-Type": "application/json"
        },
        ok: true,
        status: 204
      };
    });
    expect(((await makeRequest({ url: "test204" })) as ParsedResponse).data).toBeNull();
  });

  it("should throw error when middleware collection is invalid", async () => {
    const instance = createInstance();
    instance.middleware = "invalid middleware" as unknown as Array<Middleware<any>>;
    await expect(instance.request({ url: "testError" })).rejects.toThrowError("Middleware stack must be an array!");
  });

  it("should throw error when external middleware is invalid", async () => {
    const instance = createInstance();
    instance.use("invalid middleware" as unknown as Middleware<any>);
    await expect(instance.request({ url: "testError" })).rejects.toThrowError(
      "Middleware must be composed of functions!"
    );
  });

  it("can support custom middleware", async () => {
    const instance = createInstance();
    instance.use(async (context, next) => {
      const requestConfig = context.req;
      requestConfig.url = `${requestConfig.url}/customMiddleware`;
      await next();
    });

    fetchMock.mockOnce(async (req) => {
      expect(req.url).toBe("/test/customMiddleware");
      return {
        ok: true,
        status: 200,
        body: "success"
      };
    });

    await instance.request({ url: "/test" });
  });
});
