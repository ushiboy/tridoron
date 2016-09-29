import React from 'react';
import { render } from 'react-dom';
import { route, Provider, Link } from '../src';

function fetchTodos() {

}

function fetchTodo(id) {

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
        <Link href="/todos">Back</Link>
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

function App(props) {
  const { routes } = props;

  // use routing views
  return (
    <div>
      <Provider routes={routes} {...props} />
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
  <App routes={routes} todos={[]} />,
  document.getElementById('app')
);
