/* @flow */
import React from 'react';
import pathToRegexp from 'path-to-regexp';

export type RouteHandler = (args: any, query: any, environment: any) => Promise<void>;

export type Route = {
  path: string,
  matcher: RegExp,
  component: Class<React$Component<any, any>>,
  handler?: RouteHandler
};

export function route(
  path: string,
  component : Class<React$Component<any, any>>,
  handler? : RouteHandler
): Route {
  const matcher = pathToRegexp(path);
  return {
    path,
    matcher,
    component,
    handler
  };
}
