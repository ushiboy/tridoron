const assert = require('assert');
import sinon from 'sinon';
import { Hash, History, createFixedUrlEngine } from '../src/engine';
const jsdom = require('jsdom/lib/old-api.js');

describe('Hash', () => {

  let handler;

  beforeEach(() => {
    handler = sinon.spy();
  });

  describe('#start()', () => {
    it('should set location.hash', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new Hash(handler);
      engine.start();
      assert(location.hash === '#/');
    });
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new Hash(handler);
      engine.start();
      assert.ok(handler.calledOnce);
    });
    it('should not call handler when autoChangeFirstRoute was false', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new Hash(handler);
      engine.start(false);
      assert(handler.callCount === 0);
    });
  });

  describe('#navigateTo()', () => {
    it('should set location.hash', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new Hash(handler);
      engine.navigateTo('/path/to');
      assert(location.hash === '#/path/to');
    });
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new Hash(handler);
      engine.navigateTo('/');
      assert.ok(handler.calledOnce);
    });
    it('should not call handler', () => {
      jsdom.changeURL(window, 'http://localhost/#/');
      const engine = new Hash(handler);
      engine.navigateTo('/path/to');
      assert(handler.callCount === 0);
    });
  });

  describe('#replaceTo()', () => {
    it('throws error', () => {
      const engine = new Hash(handler);
      assert.throws(() => { engine.replaceTo('/path'); }, e => { assert(e.message === 'Not support.'); return true; });
    });
  });

  describe('#getCurrentHref()', () => {
    it('should return "/"', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new Hash(handler);
      assert(engine.getCurrentHref() === '/');
    });
    it('should return "/path/to"', () => {
      jsdom.changeURL(window, 'http://localhost/#/path/to');
      const engine = new Hash(handler);
      assert(engine.getCurrentHref() === '/path/to');
    });
    it('should return "/path/to?hoge=1&fuga=2"', () => {
      jsdom.changeURL(window, 'http://localhost/#/path/to?hoge=1&fuga=2');
      const engine = new Hash(handler);
      assert(engine.getCurrentHref() === '/path/to?hoge=1&fuga=2');
    });
  });

});

describe('History', () => {

  let handler;

  beforeEach(() => {
    handler = sinon.spy();
  });

  describe('#start()', () => {
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new History(handler);
      engine.start();
      assert.ok(handler.calledOnce);
    });
    it('should not call handler when autoChangeFirstRoute was false', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new History(handler);
      engine.start(false);
      assert(handler.callCount === 0);
    });
  });

  describe('#navigateTo()', () => {
    it('should change location.pathname', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new History(handler);
      engine.navigateTo('/path/to');
      assert(location.pathname === '/path/to');
    });
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new History(handler);
      engine.navigateTo('/path/to');
      assert.ok(handler.calledOnce);
    });
  });

  describe('#replaceTo()', () => {
    it('should change location.pathname', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new History(handler);
      engine.replaceTo('/path/to');
      assert(location.pathname === '/path/to');
    });
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new History(handler);
      engine.replaceTo('/path/to');
      assert.ok(handler.calledOnce);
    });
  });

  describe('#getCurrentHref()', () => {
    it('should return "/"', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new History(handler);
      assert(engine.getCurrentHref() === '/');
    });
    it('should return "/path/to"', () => {
      jsdom.changeURL(window, 'http://localhost/path/to');
      const engine = new History(handler);
      assert(engine.getCurrentHref() === '/path/to');
    });
    it('should return "/path/to?hoge=1&fuga=2"', () => {
      jsdom.changeURL(window, 'http://localhost/path/to?hoge=1&fuga=2');
      const engine = new History(handler);
      assert(engine.getCurrentHref() === '/path/to?hoge=1&fuga=2');
    });
  });

});

describe('createFixedUrlEngine', () => {

  let handler;
  const url = '/path/to';
  const FixedEngine = createFixedUrlEngine(url);

  beforeEach(() => {
    handler = sinon.spy();
  });

  describe('#start()', () => {
    it('should call handler', () => {
      const engine = new FixedEngine(handler);
      engine.start();
      assert.ok(handler.calledOnce);
    });
    it('should not call handler when autoChangeFirstRoute was false', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const engine = new FixedEngine(handler);
      engine.start(false);
      assert(handler.callCount === 0);
    });
  });

  describe('#navigateTo()', () => {
    it('throws error', () => {
      const engine = new FixedEngine(handler);
      assert.throws(() => { engine.navigateTo('/path'); }, e => { assert(e.message === 'Not support.'); return true; });
    });
  });

  describe('#replaceTo()', () => {
    it('throws error', () => {
      const engine = new FixedEngine(handler);
      assert.throws(() => { engine.replaceTo('/path'); }, e => { assert(e.message === 'Not support.'); return true; });
    });
  });
  describe('#getCurrentHref()', () => {
    it('should return initialize url', () => {
      const engine = new FixedEngine(handler);
      assert(engine.getCurrentHref() === url);
    });
  });

});
