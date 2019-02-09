/* @flow */
import React, { Children } from 'react';
import PropTypes from 'prop-types';
import { EventEmitter } from 'fbemitter';
import parse from 'url-parse';
import { History, Hash } from './engine'
import type { Engine } from './engine';
import type { Route, RouteHandler } from './route';

type Adapter = (router: Router) => () => Promise<void>

export type RouterOptions = {
  environment?: any,
  adapter?: Adapter
}

type EngineClass = Class<History> | Class<Hash>


export class Router {

  _provider: (props: any) => any
  _content: (props: any) => any
  _engine: Engine
  _events: EventEmitter
  _routes: Route[]
  _environment: any
  _adapter: (fn: Promise<void>) => Promise<void>

  get provider() {
    return this._provider;
  }

  get content() {
    return this._content;
  }

  get engineType() {
    return this._engine.type;
  }

  constructor(
    engine: EngineClass,
    routes: Route[],
    options: RouterOptions = { environment:undefined, adapter:undefined }
  ) {
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

  setAdapter(adapter: Adapter) {
    this._adapter = adapter(this);
  }

  handleEngine(href: string) {
    const matched = this.match(href);
    if (matched) {
      const { args, handler, query } = matched;
      const fn = handler ? handler.call(handler, args, query, this._environment) : Promise.resolve();
      this._adapter(fn).then(() => {
        this._events.emit('change', href, args, query, true);
      });
    } else {
      this._events.emit('change', href, [], {}, false);
    }
  }

  match(href: string) {
    let matched, args;
    const url = parse(href, true);
    const { pathname, query } = url;
    const route = this._routes.find(route => {
      matched = route.matcher.exec(pathname);
      if (matched != null) {
        args = matched.slice(1);
        return true;
      }
      return false;
    });
    if (!route) return null;
    return Object.assign({}, route, {
      args,
      query
    });
  }

  start(autoChangeFirstRoute: boolean=true) {
    this._engine.start(autoChangeFirstRoute);
  }

  startWith(matchedRoute: any) {
    const { args, handler, query } = matchedRoute;
    if (handler) {
      return handler.apply(handler, args.concat(query, this._environment));
    } else {
      return Promise.resolve();
    }
  }

  listen(listener: any) {
    this._events.addListener('change', listener);
  }

  navigateTo(href: string) {
    this._engine.navigateTo(href);
  }

  replaceTo(href: string) {
    this._engine.replaceTo(href);
  }

  getCurrentHref() {
    return this._engine.getCurrentHref();
  }

  getCurrentRoute() {
    return this.match(this.getCurrentHref());
  }

}

type ProviderProps = {
  children: any,
  router: Router
}

export class Provider extends React.Component<ProviderProps> {

  _router: Router

  constructor(props: ProviderProps) {
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

type ContentProps = {
  router: Router
}

export class Content extends React.Component<ContentProps> {

  _router: Router

  constructor(props: ContentProps) {
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

export type LinkProps = {
  children: any,
  href: string
}

export class Link extends React.Component<LinkProps> {

  render() {
    const { children, href } = this.props;
    const linkHref = this.context.router.engineType === 'hash' ? `#${href}` : href;
    return (
      <a {...this.props} href={linkHref} onClick={this.handleClick.bind(this)}>{children}</a>
    );
  }

  handleClick(e: any) {
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
