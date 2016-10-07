import { EventEmitter } from 'fbemitter';

export class Hash extends EventEmitter {

  constructor(handler) {
    super();
    this.addListener('change', handler);
    this.handleHashChange = this.handleHashChange.bind(this);
  }

  start() {
    window.addEventListener('hashchange', this.handleHashChange, false);
    this.navigateTo(this.getCurrentPath());
  }

  handleHashChange(e) {
    this.emit('change', this.getCurrentPath());
  }

  navigateTo(href) {
    if (this.getCurrentPath() === href) {
      this.emit('change', this.getCurrentPath());
    }
    location.hash = href;
  }

  replaceTo(href) {
    throw new Error('Not support.');
  }

  getCurrentPath() {
    return location.hash.slice(1) || '/';
  }

}

export class History extends EventEmitter {

  constructor(handler) {
    super();
    this.addListener('change', handler);
    this.handlePopState = this.handlePopState.bind(this);
  }

  start() {
    window.addEventListener('popstate', this.handlePopState, false);
    this.emit('change', this.getCurrentPath());
  }

  handlePopState(e) {
    this.emit('change', this.getCurrentPath());
  }

  navigateTo(href) {
    history.pushState(href, null, href);
    this.emit('change', href);
  }

  replaceTo(href) {
    history.replaceState(href, null, href);
    this.emit('change', href);
  }

  getCurrentPath() {
    return history.state || '/';
  }

}
