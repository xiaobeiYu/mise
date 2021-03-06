import { dom, component } from 'mise';

import { template } from './todos.template';
import { state } from './todos.state';
import * as actions from './todos.actions';

component({
  template,
  state,
  actions,
});
