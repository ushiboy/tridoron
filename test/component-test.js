const assert = require('assert');
import sinon from 'sinon';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { Router, Provider, Link } from '../src/component';
import { History } from '../src/engine';
import { route } from '../src/route';
const jsdom = require('jsdom/lib/old-api.js');


function RootPage(props) {
  return (
    <div>root</div>
  );
}
function FooPage(props) {
  return (
    <div>
      <Link href="/">foo</Link>
    </div>
  );
}
function BarPage(props) {
  return (
    <div>bar</div>
  );
}

describe('Router', () => {

  let rootHandler;
  let fooHandler;
  let barHandler;
  let listener;
  let router;
  let routes;

  beforeEach(() => {
    rootHandler = sinon.spy();
    fooHandler = sinon.spy();
    barHandler = sinon.spy();
    listener = sinon.spy();
    routes = [
      route('/', RootPage, rootHandler),
      route('/foo/:id', FooPage, fooHandler),
      route('/bar/:id/baz/:name', BarPage, barHandler)
    ];
    router = new Router(History, routes);
    router.listen(listener);
  });

  describe('#start()', () => {
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      router.start();
      assert.ok(rootHandler.calledOnce);
    });
  });

  describe('#handleEngine()', () => {
    it('should call listener when match route', () => {
      router.handleEngine('/foo/1');
      assert.ok(listener.calledWith('/foo/1', true));
    });
    it('should call listener when do not match route', () => {
      router.handleEngine('/faa/1');
      assert.ok(listener.calledWith('/faa/1', false));
    });
  });

  describe('#navigateTo()', () => {
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/');
      router.navigateTo('/foo/1');
      assert.ok(fooHandler.calledWith(['1']));
    });
    it('should call handler with query parameters', () => {
      jsdom.changeURL(window, 'http://localhost/');
      router.navigateTo('/bar/1/baz/abc?q=2');
      assert.ok(barHandler.calledWith(['1', 'abc'], { q: '2'}));
    });

    context('use options.environment', () => {
      it('should call handler with environment parameters', () => {
        const environment = 'my environment';
        const optRouter = new Router(History, routes, { environment });
        jsdom.changeURL(window, 'http://localhost/');
        optRouter.navigateTo('/foo/1');
        assert.ok(fooHandler.calledWith(['1'], {}, environment));
      });
    });

  });

  describe('#replaceTo()', () => {
    it('should call handler', () => {
      jsdom.changeURL(window, 'http://localhost/foo/1');
      router.replaceTo('/');
      assert.ok(rootHandler.calledOnce);
    });
  });

  describe('#getCurrentHref()', () => {
    it('should return "/foo/1"', () => {
      jsdom.changeURL(window, 'http://localhost/foo/1');
      assert(router.getCurrentHref() === '/foo/1');
    });
  });

  describe('#getCurrentRoute()', () => {
    it('should return match object', () => {
      jsdom.changeURL(window, 'http://localhost/');
      const route = router.getCurrentRoute();
      assert(route.path === '/');
      assert(route.handler === rootHandler);
      assert(route.component === RootPage);
    });
  });

  describe('Provider', () => {

    describe('Content', () => {

      it('should render matched component', () => {
        jsdom.changeURL(window, 'http://localhost/');
        const wrapper = mount(<router.content />);
        assert(wrapper.find('div').text() === 'root');
      });

      describe('Link', () => {

        it('should accept a tag', () => {
          jsdom.changeURL(window, 'http://localhost/foo/1');
          const wrapper = mount(
            <router.provider>
              <router.content />
            </router.provider>
          );
          const a = wrapper.find('a');
          assert(a.text() === 'foo');
          assert(a.prop('href') === '/');
        });

        it('should call router navgateTo when Link is clicked', () => {
          jsdom.changeURL(window, 'http://localhost/foo/1');
          const wrapper = mount(
            <router.provider>
              <router.content />
            </router.provider>
          );
          const a = wrapper.find('a');
          a.simulate('click');
          assert.ok(rootHandler.calledOnce);
        });

      });

    });

    describe('Link', () => {

      it('should accept a tag', () => {
        jsdom.changeURL(window, 'http://localhost/foo/1');
        const wrapper = mount(
          <router.provider>
            <Link href="/">foo</Link>
          </router.provider>
        );
        const a = wrapper.find('a');
        assert(a.text() === 'foo');
        assert(a.prop('href') === '/');
      });

      it('should call router navgateTo when Link is clicked', () => {
        jsdom.changeURL(window, 'http://localhost/foo/1');
        const wrapper = mount(
          <router.provider>
            <Link href="/">foo</Link>
          </router.provider>
        );
        const a = wrapper.find('a');
        a.simulate('click');
        assert.ok(rootHandler.calledOnce);
      });

    });

  });

});
