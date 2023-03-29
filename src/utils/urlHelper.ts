const URL_SLASH_CHAR = "/";
const URL_DOT_SLASH_CHARS = "./";

export function appendUrl(baseURL = "", url = ""): string {
  if (!url) {
    return baseURL;
  }

  if (!baseURL) {
    return url;
  }

  // Absolute urls are not modified
  if (/^(https?:|)\/\//.test(url)) {
    return url;
  }

  // Strip the first/last forward slash with baseURL
  const l = baseURL.length;
  if (baseURL.charAt(l - 1) === URL_SLASH_CHAR) {
    baseURL = baseURL.substring(0, l - 1);
  }

  // Strip the first/last forward slash or dot with url
  if (url.charAt(0) === URL_SLASH_CHAR) {
    url = url.substring(1);
  } else if (url.slice(0, URL_DOT_SLASH_CHARS.length) === URL_DOT_SLASH_CHARS) {
    url = url.substring(URL_DOT_SLASH_CHARS.length);
  }

  // Url that already contains baseURL would not be modified
  if (`/${url}`.startsWith(baseURL)) {
    return `/${url}`;
  }
  return `${baseURL}/${url}`;
}
