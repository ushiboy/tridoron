import { EventEmitter } from 'fbemitter';

export class Hash extends EventEmitter {

  get type() {
    return 'hash';
  }

  constructor(handler) {
    super();
    this.addListener('change', handler);
    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange, false);
  }

  start() {
    this.navigateTo(this.getCurrentHref());
  }

  handleHashChange(e) {
    this.emit('change', this.getCurrentHref());
  }

  navigateTo(href) {
    const currentHref = this.getCurrentHref();
    if (currentHref === href) {
      this.emit('change', currentHref);
    }
    location.hash = href;
  }

  replaceTo(href) {
    throw new Error('Not support.');
  }

  getCurrentHref() {
    return location.hash.slice(1) || '/';
  }

}

export class History extends EventEmitter {

  get type() {
    return 'history';
  }

  constructor(handler) {
    super();
    this.addListener('change', handler);
    this.handlePopState = this.handlePopState.bind(this);
    window.addEventListener('popstate', this.handlePopState, false);
  }

  start() {
    this.emit('change', this.getCurrentHref());
  }

  handlePopState(e) {
    this.emit('change', this.getCurrentHref());
  }

  navigateTo(href) {
    history.pushState(href, null, href);
    this.emit('change', href);
  }

  replaceTo(href) {
    history.replaceState(href, null, href);
    this.emit('change', href);
  }

  getCurrentHref() {
    return location.pathname + location.search;
  }

}
