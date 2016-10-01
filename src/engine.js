import { EventEmitter } from 'fbemitter';

export class Hash extends EventEmitter {

  constructor(handler) {
    super();
    this.addListener('change', handler);
    this.handleHashChange = this.handleHashChange.bind(this);
  }

  start() {
    window.addEventListener('hashchange', this.handleHashChange, false);
  }

  handleHashChange(e) {
    this.emit('change', this.getCurrentPath());
  }

  navigateTo(path) {
    location.hash = path;
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
  }

  handlePopState(e) {
    this.emit('change', this.getCurrentPath());
  }

  navigateTo(path) {
    history.pushState(path, null, path);
  }

  getCurrentPath() {
    return history.state;
  }

}
