const assert = require('assert');
import sinon from 'sinon';
import jsdom from 'jsdom';
import { Hash, History } from '../src/engine';

describe('Hash', () => {

  let handler;
  let engine;

  beforeEach(() => {
    handler = sinon.spy();
    engine = new Hash(handler);
  });

  describe('#start()', () => {
    it('should set location.hash', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.start();
      assert(location.hash === '#/');
    });
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.start();
      assert.ok(handler.calledOnce);
    });
  });

  describe('#navigateTo()', () => {
    it('should set location.hash', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.navigateTo('/path/to');
      assert(location.hash === '#/path/to');
    });
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.navigateTo('/');
      assert.ok(handler.calledOnce);
    });
    it('should not call handler', () => {
      jsdom.changeURL(window, 'http://localhost/#/');
      engine.navigateTo('/path/to');
      assert(handler.callCount === 0);
    });
  });

  describe('#replaceTo()', () => {
    it('throws error', () => {
      assert.throws(() => { engine.replaceTo('/path'); }, e => { assert(e.message === 'Not support.'); return true; });
    });
  });

  describe('#getCurrentHref()', () => {
    it('should return "/"', () => {
      jsdom.changeURL(window, 'http://localhost/');
      assert(engine.getCurrentHref() === '/');
    });
    it('should return "/path/to"', () => {
      jsdom.changeURL(window, 'http://localhost/#/path/to');
      assert(engine.getCurrentHref() === '/path/to');
    });
    it('should return "/path/to?hoge=1&fuga=2"', () => {
      jsdom.changeURL(window, 'http://localhost/#/path/to?hoge=1&fuga=2');
      assert(engine.getCurrentHref() === '/path/to?hoge=1&fuga=2');
    });
  });

});

describe('History', () => {

  let handler;
  let engine;

  beforeEach(() => {
    handler = sinon.spy();
    engine = new History(handler);
  });

  describe('#start()', () => {
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.start();
      assert.ok(handler.calledOnce);
    });
  });

  describe('#navigateTo()', () => {
    it('should change location.pathname', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.navigateTo('/path/to');
      assert(location.pathname === '/path/to');
    });
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.navigateTo('/path/to');
      assert.ok(handler.calledOnce);
    });
  });

  describe('#replaceTo()', () => {
    it('should change location.pathname', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.replaceTo('/path/to');
      assert(location.pathname === '/path/to');
    });
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      engine.replaceTo('/path/to');
      assert.ok(handler.calledOnce);
    });
  });

  describe('#getCurrentHref()', () => {
    it('should return "/"', () => {
      jsdom.changeURL(window, 'http://localhost/');
      assert(engine.getCurrentHref() === '/');
    });
    it('should return "/path/to"', () => {
      jsdom.changeURL(window, 'http://localhost/path/to');
      assert(engine.getCurrentHref() === '/path/to');
    });
    it('should return "/path/to?hoge=1&fuga=2"', () => {
      jsdom.changeURL(window, 'http://localhost/path/to?hoge=1&fuga=2');
      assert(engine.getCurrentHref() === '/path/to?hoge=1&fuga=2');
    });
  });

});
