import Experiment from './es6/experiment';
import Interpreter from './es6/interpreter';
import Random from './es6/ops/random';
import Core from './es6/ops/core';
import * as Namespace from './es6/namespace';
import Assignment from './es6/assignment';

export default {
  Namespace: Namespace,
  Assignment: Assignment,
  Interpreter: Interpreter,
  Experiment: Experiment,
  Ops: {
    Random: Random,
    Core: Core
  }
};
