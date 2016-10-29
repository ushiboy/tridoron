import React from 'react';
import { Link } from '../src';

export class TodoList extends React.Component {

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

export class TodoForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = props.editTodo;
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
  }

  render() {
    const { title, id } = this.state;
    const btnRemove = id != null ? <button type="button" onClick={this.handleRemove}>Remove</button> : null;
    return (
      <div>
        <Link href="/">Back</Link>
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="title" value={title} onChange={this.handleChange} />
          <button type="submit">Save</button>
          {btnRemove}
        </form>
      </div>
    );
  }

  componentWillReceiveProps(props) {
    this.setState(props.editTodo);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleRemove(e) {
    this.props.actions.removeTodo(this.state);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.actions.saveTodo(this.state);
  }

}

export function Help(props) {
  return (
    <div>
      <h1>Help</h1>
    </div>
  );
}

export class App extends React.Component {

  constructor(props) {
    super(props);
    const { store } = props;
    this.state = store.getState();
    store.addListener('change', () => {
      this.setState(store.getState());
    });
  }

  render() {
    const { router, actions } = this.props;
    // use routing views
    return (
      <router.provider>
        <div>
          <ul>
            <li><Link href="/">Todo List</Link></li>
            <li><Link href="/help">Help</Link></li>
          </ul>
          <router.content {...this.state} actions={actions} />
        </div>
      </router.provider>
    );
  }
}
