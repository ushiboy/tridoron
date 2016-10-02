import React from 'react';
import { render } from 'react-dom';
import { Router, Hash, route } from '../src';
import { EventEmitter } from 'fbemitter';
import { TodoList, TodoForm, App } from './component';
import { Store } from './store';

const dispatcher = new EventEmitter();
const store = new Store(dispatcher);

function fetchTodos() {
  dispatcher.emit('loadTodos', [
    {
      id: 1,
      title: 'test'
    }
  ]);
}

function newTodo() {
  dispatcher.emit('loadTodo',
    {
      title: ''
    }
  );
}

function fetchTodo(id) {
  dispatcher.emit('loadTodo',
    {
      id: 1,
      title: 'test'
    }
  );
}

function saveTodo(todo) {

}

// define routing
const routes = [
  route('/', TodoList, fetchTodos),
  route('/todos/new', TodoForm, newTodo),
  route('/todos/:id', TodoForm, fetchTodo)
];

const router = new Router(Hash, routes);
router.listen(href => {
  dispatcher.emit('changeHref', href);
});
router.start();

render(
  <App router={router} store={store} />,
  document.getElementById('app')
);
