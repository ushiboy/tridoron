# Tridoron

(Draft)

## Usage


```javascript
import React from 'react';
import { render } from 'react-dom';
import { Router, History, route, Link } from 'tridoron';

// Views
function Index(props) {
  return (
    <div>
      <h1>Index</h1>
      <Link href="/todos">Todos</Link>
    </div>
  );
}

function TodoList(props) {
  const rows = props.todos.map(todo => {
    return <li key={todo.id}><Link href={`/todos/${todo.id}`}>{todo.title}</Link></li>;
  });
  return (
    <div>
      <Link href="/">Index</Link>
      <h1>Todos</h1>
      <ul>{rows}</ul>
    </div>
  );
}

function TodoDetail(props) {
  const { theTodo } = props;
  return (
    <div>
      <Link href="/todos">Todos</Link>
      <h1>{theTodo.title}</h1>
    </div>
  );
}

class App extends React.Component {

  constructor(props) {
    super(props);
    const { router, store } = props;
    this.state = store.getState();

    router.listen(this.handleChangeHref.bind(this));
    store.onChange(this.handleChangeStore.bind(this));
  }

  render() {
    const { router } = this.props;
    // render view of the current route
    return <router.content {...this.state} />;
  }

  handleChangeHref(href) {
    console.log(`current href: ${href}`);
    // redraw
    this.setState(store.getState());
  }

  handleChangeStore(store) {
    this.setState(store.getState());
  }

}

// sample store
const store = {

  _state: {
    todos: [],
    theTodo: {}
  },

  set(key, value) {
    this._state[key] = value;
    this._handler(this);
  },

  onChange(handler) {
    this._handler = handler;
  },

  getState() {
    return this._state;
  }
}

// define routing
const routes = [
  route('/', Index),
  route('/todos', TodoList, () => {
    fetch('/todos.json')
      .then(r => r.json())
      .then(json => {
        store.set('todos', json.todos);
      });
  }),
  route('/todos/:id', TodoDetail, id => {
    fetch(`/todo_${id}.json`)
      .then(r => r.json())
      .then(json => {
        store.set('theTodo', json);
      });
  })
];

// router initialize and launch
const router = new Router(History, routes);
router.start();

render(
  <App router={router} store={store} />,
  document.getElementById('app')
);
```
