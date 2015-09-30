import { extend, clone, forEach, isFunction } from '../lib/utils';

let globalInputArgs, experimentSpecificInputArgs = {};

const fetchInputs = (args) {
  return resolveArgs(clone(args));
};

const resolveArgs = (args) {
  forEach(Object.keys(args), (key) => {
    if (isFunction(args[key]) {
      args[key] = args[key]();
    }
  });
  return args;
};

const registerExperimentInput = (key, value, experimentName) {
  if (!experimentName) {
    globalInputArgs[key] = value;
  } else {
    if (!experimentSpecificInputArgs[experimentName]) {
      experimentSpecificInputArgs[experimentName] = {};
    }
    experimentSpecificInputArgs[experimentName][key] = value;
  }
};

const getExperimentInputs = (experimentName) {
  const inputArgs = fetchInputs(globalInputArgs);
  if (experimentName && experimentSpecificInputArgs[experimentName]) {
    return extend(inputArgs, fetchInputs(experimentSpecificInputArgs[experimentName]));
  }
  return inputArgs;
};

export default { registerExperimentInput, getExperimentInputs };