import { Context, Next } from "../interfaces/Middleware";
import { parseResponseBody } from "../utils/parseResponse";
import { ParsedResponse } from "../interfaces/Response";

async function parseResponse(context: Context, next: Next): Promise<void> {
  await next();

  if (context.res) {
    const response = context.res;

    if (!("data" in response)) {
      (context.res as ParsedResponse).data = await parseResponseBody(response);
    }
  }
}

export default parseResponse;
