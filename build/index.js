import provideAssignment from '../es6/assignment';
import provideExperiment from '../es6/experiment';
import * as ExperimentSetup from '../es6/experimentSetup';
import provideInterpreter from '../es6/interpreter';
import * as Random from '../es6/ops/random';
import * as Base from '../es6/ops/base';
import * as Core from '../es6/ops/core';
import * as OpsUtils from '../es6/ops/utils';
import provideNamespace from '../es6/namespace';

// Provide our operations to the OpsUtils module
OpsUtils.initializeOperators(Core, Random);

var Assignment = provideAssignment(Random);
var Experiment = provideExperiment(Assignment);
var Interpreter = provideInterpreter(OpsUtils, Assignment);
var Namespace = provideNamespace(Random, Assignment, Experiment);

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
