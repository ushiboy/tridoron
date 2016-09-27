# Tridoron

(Draft)

## Usage


```javascript
import React from 'react';
import render from 'react-dom';
import { route, Provider, Link } from 'tridoron';

import { fetchTodos, fetchTodo } from './todoActions';


function TodoList(props) {
  return (
    <div>
      <Link href="/todos/new">New Todo</Link>
    </div>
  );
}

function TodoForm(props) {
  return (
    <div>
    </div>
  );
}

function App(props) {
  const { routes } = props;

  // use routing views
  return (
    <div>
      <Provider routes={routes} />
    </div>
  );
}

// define routing
const routes = [
  route('/todos', TodoList, fetchTodos),
  route('/todos/new', TodoForm),
  route('/todos/:id', TodoForm, fetchTodo)
];


render(
  <App routes={routes} />,
  document.getElementById('app')
);
```
