import React from 'react';
import { EventEmitter } from 'fbemitter';

export class Router {

  get provider() {
    return this._provider;
  }

  constructor(engine, routes) {
    this._events = new EventEmitter();
    this._engine = new engine(this.handleEngine.bind(this));
    this._routes = routes;
    this._provider = props => {
      return <Provider router={this} {...props} />;
    };
  }

  handleEngine(href) {
    const matched = this.match(href);
    if (matched) {
      const { args, handler } = matched;
      if (handler) {
        handler.apply(handler, args);
      }
    }
    this._events.emit('change', href);
  }

  start() {
    this._engine.start();
  }

  listen(listener) {
    this._events.addListener('change', listener);
  }

  match(href) {
    let matched;
    const route = this._routes.find(route => {
      matched = route.matcher.exec(href);
      return matched != null;
    });
    if (!route) return null;
    return Object.assign({}, route, {
      args: matched.slice(1)
    });
  }

  navigateTo(href) {
    this._engine.navigateTo(href);
  }

  getCurrentPath() {
    return this._engine.getCurrentPath();
  }

  getCurrentRoute() {
    return this.match(this.getCurrentPath());
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
