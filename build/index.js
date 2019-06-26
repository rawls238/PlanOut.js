import planoutAPIFactory from './planoutAPIFactory';
import * as Random from '../es6/ops/random';

const paf = planoutAPIFactory({Random});
const {
  Assignment,
  Experiment,
  ExperimentSetup,
  Interpreter,
  Ops,
  Namespace,
} = paf;

export {
  Assignment,
  Experiment,
  ExperimentSetup,
  Interpreter,
  Ops,
  Namespace,
};
