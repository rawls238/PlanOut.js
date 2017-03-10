import provideAssignment from '../es6/assignment';
import provideExperiment from '../es6/experiment';
import * as ExperimentSetup from '../es6/experimentSetup';
import provideInterpreter from '../es6/interpreter';
import * as Base from '../es6/ops/base';
import * as Core from '../es6/ops/core';
import * as OpsUtils from '../es6/ops/utils';
import provideNamespace from '../es6/namespace';

export default ({
  Random = null
} = {}) => {
  // Provide our operations to the OpsUtils module
  OpsUtils.initializeOperators(Core, Random);

  // Inject our Random and other dependencies into our modules
  const Assignment = provideAssignment(Random);
  const Experiment = provideExperiment(Assignment);
  const Interpreter = provideInterpreter(OpsUtils, Assignment);
  const Namespace = provideNamespace(Random, Assignment, Experiment);

  return {
    Assignment,
    Experiment,
    ExperimentSetup,
    Interpreter,
    Ops: {
      Random,
      Core,
      Base
    },
    Namespace
  };
};
