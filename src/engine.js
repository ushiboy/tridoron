/* @flow */
import { EventEmitter } from 'fbemitter';

export interface Engine {

  +type: string;

  start(autoChangeFirstRoute: boolean): void;

  navigateTo(href: string): void;

  replaceTo(href: string): void;

  getCurrentHref(): string;

}

export type HrefChangeHandler = (href: string) => void


export class Hash extends EventEmitter implements Engine {

  handleHashChange: (e: any) => void

  get type() {
    return 'hash';
  }

  constructor(handler: HrefChangeHandler) {
    super();
    this.addListener('change', handler);
    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange, false);
  }

  start(autoChangeFirstRoute: boolean = true) {
    if (autoChangeFirstRoute === true) {
      this.navigateTo(this.getCurrentHref());
    }
  }

  handleHashChange(e : any) {
    this.emit('change', this.getCurrentHref());
  }

  navigateTo(href : string) {
    const currentHref = this.getCurrentHref();
    if (currentHref === href) {
      this.emit('change', currentHref);
    }
    location.hash = href;
  }

  replaceTo(href : string) {
    throw new Error('Not support.');
  }

  getCurrentHref() {
    return location.hash.slice(1) || '/';
  }

}

export class History extends EventEmitter implements Engine {

  handlePopState: (e: any) => void

  get type() {
    return 'history';
  }

  constructor(handler: HrefChangeHandler) {
    super();
    this.addListener('change', handler);
    this.handlePopState = this.handlePopState.bind(this);
    window.addEventListener('popstate', this.handlePopState, false);
  }

  start(autoChangeFirstRoute: boolean = true) {
    if (autoChangeFirstRoute === true) {
      this.emit('change', this.getCurrentHref());
    }
  }

  handlePopState(e: any) {
    this.emit('change', this.getCurrentHref());
  }

  navigateTo(href: string) {
    history.pushState(href, document.title, href);
    this.emit('change', href);
  }

  replaceTo(href: string) {
    history.replaceState(href, document.title, href);
    this.emit('change', href);
  }

  getCurrentHref() {
    return location.pathname + location.search;
  }

}

export function createFixedUrlEngine(url: string) : Class<Engine> {

  class FixedUrl extends EventEmitter implements Engine {

    get type() {
      return 'fixed-url';
    }

    constructor(handler) {
      super();
      this.addListener('change', handler);
    }

    start(autoChangeFirstRoute=true) {
      if (autoChangeFirstRoute === true) {
        this.emit('change', this.getCurrentHref());
      }
    }

    navigateTo(href: string) {
      throw new Error('Not support.');
    }

    replaceTo(href: string ) {
      throw new Error('Not support.');
    }

    getCurrentHref() {
      return url;
    }

  }

  return FixedUrl;
}
