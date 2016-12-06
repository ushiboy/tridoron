import React, { Children } from 'react';
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


  constructor(engine, routes, context, adapter) {
    this._events = new EventEmitter();
    this._engine = new engine(this.handleEngine.bind(this));
    this._routes = routes;
    this._context = context;
    this._adapter = function() {};
    if (adapter) {
      this._adapter = adapter(this);
    }
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
      if (handler) {
        this._adapter(handler.apply(handler, args.concat(query, this._context)));
      }
    }
    this._events.emit('change', href);
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

  start() {
    this._engine.start();
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
Provider.propTypes = {
  children: React.PropTypes.element.isRequired
};
Provider.childContextTypes = {
  router: React.PropTypes.instanceOf(Router)
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
  router: React.PropTypes.instanceOf(Router)
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
  router: React.PropTypes.instanceOf(Router)
};
