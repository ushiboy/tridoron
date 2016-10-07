# Tridoron

(Draft)

## Usage


```javascript
import React from 'react';
import render from 'react-dom';
import { route, Router, Hash } from 'tridoron';


// sample app components
import { fetchTodos, fetchTodo, newTodo } from './todoActions';
import { TodoList, TodoForm } from './components';
import Store from './store';
const store = new Store();


class App extends React.Component {

  constructor(props) {
    super(props);
    const { store } = props;
    this.state = store.getState();
    store.addListener('change', () => {
      this.setState(store.getState());
    });
  }

  render() {
    const { router } = this.props;
    // use routing views
    return <router.provider {...this.state} />;
  }
}

// define routing
const routes = [
  route('/todos', TodoList, fetchTodos),
  route('/todos/new', TodoForm, newTodo),
  route('/todos/:id', TodoForm, fetchTodo)
];

// initialize router
const router = new Router(Hash, routes);
router.start();

render(
  <App router={router} store={store} />,
  document.getElementById('app')
);
```
