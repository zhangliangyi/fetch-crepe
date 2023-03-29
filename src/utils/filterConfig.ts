/**
 * Filter out some props from the config, returning a config which only has the props
 * that were not being filtered.
 *
 * @param {Object} config
 * @param {Array.<String>} props
 * @param {Boolean} keep true if you want these props only, and filter out others; false will remove these props.
 */
export default function <T>(config: T, props: string[], keep = false): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const keys: { [key: string]: boolean } = {};
  props.forEach((prop) => {
    keys[prop] = true;
  });
  Object.entries(config as any).forEach(([key, value]) => {
    const isKey = keep ? keys[key] : !keys[key];
    if (isKey) result[key] = value;
  });
  return result;
}
