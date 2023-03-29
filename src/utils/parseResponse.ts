const CODE_NO_CONTENT = 204;

export async function parseResponseBody(response: Response) {
  const { ok, headers } = response;
  if (!ok) {
    throw Object.assign(new Error(), {
      response
    });
  }
  const contentType = headers && headers.get("Content-Type");
  let responseBody = null;
  if (contentType && /^application\/json(;.*|)$/.test(contentType)) {
    if (response.status !== CODE_NO_CONTENT) {
      responseBody = await response.json();
    }
  } else if (response.text) {
    responseBody = await response.text();
  }
  return responseBody;
}
