import React from 'react';

export function route(path, component, action) {
  return {
    path,
    component,
    action
  };
}

export function Provider(props) {
  const { routes } = props;

  const matched = routes[0];
  return (
    <matched.component {...props} />
  );
}

export function Link(props) {
  const { children, href } = props;
  return (
    <a href={href}>{children}</a>
  );
}
