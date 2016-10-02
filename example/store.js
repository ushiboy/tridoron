import { EventEmitter } from 'fbemitter';

export class Store extends EventEmitter {

  constructor(dispatcher) {
    super();
    this._state = {
      todos: [],
      editTodo: {}
    };
    dispatcher.addListener('loadTodos', this.handleLoadTodos.bind(this));
    dispatcher.addListener('loadTodo', this.handleLoadTodo.bind(this));
  }

  getState() {
    return this._state;
  }

  handleLoadTodos(todos) {
    this._state.todos = todos;
    this.emit('change');
  }

  handleLoadTodo(todo) {
    this._state.editTodo = todo;
    this.emit('change');
  }

}
