import { Hash, History } from './engine';
import { Router, Provider, Link } from './component';
import { route } from './route';
import * as redux from './adapters/redux';

const adapter = {
  redux
};

export {
  Router,
  Provider,
  Link,
  Hash,
  History,
  route,
  adapter
};
