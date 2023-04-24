/**
 * Gets the property value at path of object. If the resolved value is undefined the defaultValue is used in its place.
 * @param object
 * @param path
 * @param fallback
 * @returns
 */
export function get<T extends any>(object: { [key: string]: T | any }, path: string, fallback?: T): T | undefined {
  const dot = path.indexOf('.');

  if (typeof object !== "object" || object === null || Array.isArray(object)) {
    return fallback || undefined;
  }

  if (dot === -1) {
    if (path.length && path in object) { return object[path]; }

    return fallback || undefined;
  }

  return get(object[path.slice(0, dot)], path.slice(dot + 1), fallback);
}
