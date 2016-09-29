import React from 'react';
import pathToRegexp from 'path-to-regexp';

export class Hash {

  constructor(handler) {
    this._handler = handler;
    this.handleHashChange = this.handleHashChange.bind(this);
  }

  start() {
    window.addEventListener('hashchange', this.handleHashChange, false);
  }

  handleHashChange(e) {
    if (this._handler) {
      this._handler(this.getPath());
    }
  }

  navigateTo(path) {
    location.hash = path;
  }

  getPath() {
    return location.hash.slice(1) || '/';
  }

}

export class Router {

  constructor(engine, routes) {
    this._engine = new engine(() => {
      if (this._listener) {
        this._listener();
      }
    });
    this._routes = routes;
  }

  start() {
    this._engine.start();
  }

  listen(listener) {
    this._listener = listener;
  }

  match(path) {
    return match(path, this._routes);
  }

  navigateTo(path) {
    this._engine.navigateTo(path);
    return navigateTo(path, this._routes);
  }

  getPath() {
    return this._engine.getPath();
  }

  getCurrentRoute() {
    return this.match(this.getPath());
  }

}

export function route(path, component, action) {
  const matcher = pathToRegexp(path);
  return {
    path,
    matcher,
    component,
    action
  };
}

export function match(path, routes) {
  let matched;
  const route = routes.find(route => {
    matched = route.matcher.exec(path);
    return matched != null;
  });
  if (!route) return null;
  return Object.assign({}, route, {
    args: matched.slice(1)
  });
}

export function navigateTo(path, routes) {
  const matched = match(path, routes);
  if (matched) {
    const { args, action } = matched;
    if (action) {
      action.apply(action, args);
    }
  }
}

export class Provider extends React.Component {

  constructor(props) {
    super(props);
    this._router = props.router;
  }

  getChildContext() {
    return {
      router: this._router
    };
  }

  render() {
    const route = this._router.getCurrentRoute();
    if (route) {
      return (
        <route.component {...this.props} />
      );
    } else {
      return null;
    }
  }
}
Provider.childContextTypes = {
  router: React.PropTypes.instanceOf(Router)
};

export class Link extends React.Component {

  render() {
    const { children, href } = this.props;
    const { router } = this.context;
    return (
      <a href={href} onClick={e => {
        e.preventDefault();
        router.navigateTo(href);
      }}>{children}</a>
    );
  }

}
Link.contextTypes = {
  router: React.PropTypes.instanceOf(Router)
};
