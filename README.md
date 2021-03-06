# Tridoron

Tridoron is a routing library for React.

## Usage

### Define route

Define routing by setting path, view and handler as argument of route method.

```javascript
import { route } from 'tridoron';

/**
 * route
 * @param {String} path
 * @param {React.Component} view
 * @param {(args: Array<string>, query: any) => Promise<*>} handler (optional)
 */

const routes = [
  route('/', Index),
  route('/todos', TodoList, todosListPageHandler),
  route('/todos/:id', TodoDetail, todoDetailPageHandler)
];
```

### Create Router

Configure the engine (History or Hash) and list of routes to create an instance of the router.

```javascript
import { Router, History } from 'tridoron';

const router = new Router(History, routes);
router.start();
```

### Render the View

The render method of the main component returns <router.content>.

```javascript
import React from 'react';
import { render } from 'react-dom';

class SomeComponent extends React.Component {

  render() {
    const { router } = this.props;
    return (
      <router.content />
    );
  }

}

render(
  <SomeComponent router={router} />,
  document.getElementById('app')
);
```

## Example


```javascript
import React from 'react';
import { render } from 'react-dom';
import { Router, History, route, Link } from 'tridoron';

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

// define routes
const routes = [
  route('/', Index),
  route('/todos', TodoList, () => {
    fetch('/todos.json')
      .then(r => r.json())
      .then(json => {
        store.set('todos', json.todos);
      });
  }),
  route('/todos/:id', TodoDetail, ([id]) => {
    fetch(`/todo_${id}.json`)
      .then(r => r.json())
      .then(json => {
        store.set('theTodo', json);
      });
  })
];

// router initialize, set up with History API
const router = new Router(History, routes);
// router launch.
router.start();

render(
  <App router={router} store={store} />,
  document.getElementById('app')
);
```

## Change Log

### 0.3.4-dev

Update dependencies.

## License

MIT
