import * as webapi from './webapi';

export function fetchTodos() {
  return dispatch => {
    webapi.fetchList().then(todos => {
      dispatch({
        type: 'loadTodos',
        payload: todos
      })
    });
  };
}

export function newTodo() {
  return {
    type: 'loadTodo',
    payload: {
      title: ''
    }
  };
}

export function fetchTodo(id) {
  return dispatch => {
    webapi.fetch(Number(id)).then(todo => {
      dispatch({
        type: 'loadTodo',
        payload: todo
      })
    });
  };
}

export function saveTodo(todo) {
  return (dispatch, navigateTo) => {
    webapi.save(todo).then(todo => {
      navigateTo('/');
    });
  };
}

export function removeTodo(todo) {
  return (dispatch, navigateTo) => {
    webapi.remove(todo).then(() => {
      navigateTo('/', true);
    });
  };
}
