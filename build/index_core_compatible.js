import Assignment from '../es6/assignment';
import Experiment from '../es6/experiment';
import * as ExperimentSetup from '../es6/experimentSetup';
import Interpreter from '../es6/interpreter';
import * as Random from '../es6/ops/randomPlanoutCoreCompatible';
import * as Base from '../es6/ops/base';
import * as Core from '../es6/ops/core';
import * as OpsUtils from '../es6/ops/utils';
import * as Namespace from '../es6/namespace';

OpsUtils.registerOperators({
    "randomFloat": Random.RandomFloat,
    "randomInteger": Random.RandomInteger,
    "bernoulliTrial": Random.BernoulliTrial,
    "bernoulliFilter": Random.BernoulliFilter,
    "uniformChoice": Random.UniformChoice,
    "weightedChoice": Random.WeightedChoice,
    "sample": Random.Sample
}, true);

export default {
  Assignment: Assignment,
  Experiment: Experiment,
  ExperimentSetup: ExperimentSetup,
  Interpreter: Interpreter,
  Ops: {
    Random: Random,
    Core: Core,
    Base: Base
  },
  Namespace: Namespace
};
