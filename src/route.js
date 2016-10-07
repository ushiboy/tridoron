import pathToRegexp from 'path-to-regexp';

export function route(path, component, handler) {
  const matcher = pathToRegexp(path);
  return {
    path,
    matcher,
    component,
    handler
  };
}
