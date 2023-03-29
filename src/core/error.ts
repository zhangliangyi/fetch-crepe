async function parseError(reason: any) {
  if (!reason) return reason;

  // Error response
  if (reason.response) {
    const errorResponse = reason.response;
    const { error } = await errorResponse.json();
    return {
      name: reason.name,
      code: error?.code || errorResponse.status || "UNKNOWN",
      message: error?.message || errorResponse.statusText,
      details: error?.details || null,
      response: errorResponse
    };
  }
  if (reason.message.includes("Failed to fetch")) {
    return {
      name: "NetworkError",
      message: reason.message
    };
  }
  return reason;
}

export default parseError;
