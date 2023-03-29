import { Context, Next } from "../interfaces/Middleware";
import { fetchMock, shouldMock } from "../core/mock";
import filterConfig from "../utils/filterConfig";
import { appendUrl } from "../utils/urlHelper";

async function fetchData(context: Context, next: Next) {
  const { req } = context;
  const { baseURL, url = "" } = req;
  const fetchUrl = appendUrl(baseURL, url);

  if (fetchUrl) {
    if (shouldMock(req)) {
      // eslint-disable-next-line require-atomic-updates
      context.res = await fetchMock(url, req);
    } else {
      const FETCH_OPTIONS = [
        "method",
        "mode",
        "cache",
        "credentials",
        "body",
        "referrer",
        "referrerPolicy",
        "headers",
        "signal"
      ];
      // eslint-disable-next-line require-atomic-updates
      context.res = await fetch(fetchUrl, filterConfig(req, FETCH_OPTIONS, true));
    }
  }

  await next();
}

export default fetchData;
