import React from 'react';
import { render } from 'react-dom';
import { Router, Hash, route } from '../src';
import { EventEmitter } from 'fbemitter';
import { TodoList, TodoForm, App } from './component';
import { Store } from './store';
import * as actions from './action';

const dispatcher = new EventEmitter();
const store = new Store(dispatcher);

function dispatch(action) {
  if (typeof(action) === 'function') {
    action(({type, payload}) => {
      dispatcher.emit(type, payload);
    });
  } else {
    const { type, payload } = action;
    dispatcher.emit(type, payload);
  }
}

function bindActionCreators(actions, dispatch) {
  return Object.keys(actions).reduce((result, key) => {
    const fn = actions[key];
    result[key] = function() {
      return dispatch(fn.apply(fn, arguments));
    };
    return result;
  }, {});
}


// define routing
const routes = [
  route('/', TodoList, () => {
    dispatch(actions.fetchTodos());
  }),
  route('/todos/new', TodoForm, () => {
    dispatch(actions.newTodo());
  }),
  route('/todos/:id', TodoForm, id => {
    dispatch(actions.fetchTodo(id));
  })
];

const router = new Router(Hash, routes);
router.listen(href => {
  dispatch({
    type: 'changeHref',
    payload: href
  });
});
router.start();

const bindedActions = bindActionCreators(actions, dispatch);

render(
  <App router={router} store={store} actions={bindedActions} />,
  document.getElementById('app')
);
