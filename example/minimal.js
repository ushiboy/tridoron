import React from 'react';
import { render } from 'react-dom';
import { Router, Hash, route, Link } from '../src';

function fetchTodos() {
  console.log('fetch');
}

function fetchTodo(id) {
  console.log(id);
}


class TodoList extends React.Component {

  render() {
    const { todos } = this.props;
    const rows = todos.map(todo => {
      return (
        <tr key={todo.id}>
          <td><Link href={`/todos/${todo.id}`}>{todo.title}</Link></td>
        </tr>
      );
    });

    return (
      <div>
        <Link href="/todos/new">New Todo</Link>
        <table>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  }

}

class TodoForm extends React.Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <Link href="/">Back</Link>
        <form onSubmit={this.handleSubmit}>
          <input type="text" />
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
  }

}

class App extends React.Component {

  constructor(props) {
    super(props);
    props.router.listen(href => {
      this.setState({
        href
      });
    });
  }

  render() {
    const { router } = this.props;
    // use routing views
    return <router.provider {...this.props} />;
  }
}

// define routing
const routes = [
  route('/', TodoList, fetchTodos),
  route('/todos/new', TodoForm),
  route('/todos/:id', TodoForm, fetchTodo)
];

const router = new Router(Hash, routes);
router.start();

render(
  <App router={router} todos={[]} />,
  document.getElementById('app')
);
