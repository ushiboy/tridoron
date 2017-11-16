import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { EventEmitter } from 'fbemitter';
import parse from 'url-parse';

export class Router {

  get provider() {
    return this._provider;
  }

  get content() {
    return this._content;
  }

  get engineType() {
    return this._engine.type;
  }

  constructor(engine, routes, options={ environment:undefined, adapter:undefined }) {
    this._events = new EventEmitter();
    this._engine = new engine(this.handleEngine.bind(this));

    this._routes = routes;
    this._environment = options.environment;
    this._adapter = options.adapter ? options.adapter(this) : () => Promise.resolve();
    this._provider = props => {
      return <Provider router={this} {...props}>{props.children}</Provider>;
    };
    this._content = props => {
      return <Content router={this} {...props} />;
    };
  }

  handleEngine(href) {
    const matched = this.match(href);
    if (matched) {
      const { args, handler, query } = matched;
      const fn = handler ? handler.call(handler, args, query, this._environment) : Promise.resolve();
      this._adapter(fn).then(() => {
        this._events.emit('change', href, true);
      });
    } else {
      this._events.emit('change', href, false);
    }
  }

  match(href) {
    let matched;
    const url = parse(href, true);
    const { pathname, query } = url;
    const route = this._routes.find(route => {
      matched = route.matcher.exec(pathname);
      return matched != null;
    });
    if (!route) return null;
    return Object.assign({}, route, {
      args: matched.slice(1),
      query
    });
  }

  start(autoChangeFirstRoute=true) {
    this._engine.start(autoChangeFirstRoute);
  }

  startWith(matchedRoute) {
    const { args, handler, query } = matchedRoute;
    if (handler) {
      return handler.apply(handler, args.concat(query, this._environment));
    } else {
      return Promise.resolve();
    }
  }

  listen(listener) {
    this._events.addListener('change', listener);
  }

  navigateTo(href) {
    this._engine.navigateTo(href);
  }

  replaceTo(href) {
    this._engine.replaceTo(href);
  }

  getCurrentHref() {
    return this._engine.getCurrentHref();
  }

  getCurrentRoute() {
    return this.match(this.getCurrentHref());
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
    return Children.only(this.props.children)
  }
}
Provider.childContextTypes = {
  router: PropTypes.instanceOf(Router)
};

export class Content extends React.Component {

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
Content.childContextTypes = {
  router: PropTypes.instanceOf(Router)
};

export class Link extends React.Component {

  render() {
    const { children, href } = this.props;
    const linkHref = this.context.router.engineType === 'hash' ? `#${href}` : href;
    return (
      <a {...this.props} href={linkHref} onClick={this.handleClick.bind(this)}>{children}</a>
    );
  }

  handleClick(e) {
    if (e.button === 1 || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      // skip
      return;
    }
    e.preventDefault();
    this.context.router.navigateTo(this.props.href);
  }

}
Link.contextTypes = {
  router: PropTypes.instanceOf(Router)
};
