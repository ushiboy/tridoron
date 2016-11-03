export function createAdapter(store) {
  return router => {

    router.listen(href => {
      store.dispatch(changeRoute(href));
    });

    return action => {
      if (action instanceof Promise) {
        action.then(result => {
          store.dispatch(result);
        });
      } else {
        store.dispatch(action);
      }
    };
  };
}

export const TRIDORON_CHANGE_ROUTE = Symbol();

export function changeRoute(href) {
  return {
    type: TRIDORON_CHANGE_ROUTE,
    payload: href
  };
}

export function reducer(state = { href: '' }, action) {
  switch (action.type) {
    case TRIDORON_CHANGE_ROUTE:
      return Object.assign({}, state, {
        href: action.payload
      });
    default:
      return state;
  }
}
