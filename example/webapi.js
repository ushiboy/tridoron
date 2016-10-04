var SEQ = 3;

const todos = [
  {
    id: 1,
    title: 'test 1'
  },
  {
    id: 2,
    title: 'test 2'
  },
  {
    id: 3,
    title: 'test 3'
  }
];

function find(id) {
  return todos.find(r => {
    return r.id === id;
  });
}

export function fetch(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const row = find(id);
      if (row) {
        resolve(Object.assign({}, row));
      } else {
        reject(new Error('no data'));
      }
    }, 10);
  });
}

export function fetchList() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(todos.concat());
    }, 10);
  });
}

export function save(todo) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const row = find(todo.id);
      if (row) {
        row.title = todo.title;
        resolve(Object.assign({}, row));
      } else {
        const index = todos.push({
          id: ++SEQ,
          title: todo.title
        });
        resolve(Object.assign({}, todos[index]));
      }
    }, 10);
  });
}
