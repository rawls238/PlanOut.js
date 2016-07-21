import { extend, shallowCopy, forEach, isFunction } from './lib/utils';

let globalInputArgs = {};
let experimentSpecificInputArgs = {};

const fetchInputs = (args) => {
  if (!args) { 
    return {}; 
  }

  return resolveArgs(shallowCopy(args));
};

const resolveArgs = (args) => {
  forEach(Object.keys(args), (key) => {
    if (isFunction(args[key])) {
      args[key] = args[key]();
    }
  });
  return args;
};

const registerExperimentInput = (key, value, experimentName) => {
  if (!experimentName) {
    globalInputArgs[key] = value;
  } else {
    if (!experimentSpecificInputArgs[experimentName]) {
      experimentSpecificInputArgs[experimentName] = {};
    }
    experimentSpecificInputArgs[experimentName][key] = value;
  }
};

const getExperimentInputs = (experimentName) => {
  const inputArgs = fetchInputs(globalInputArgs);
  if (experimentName && experimentSpecificInputArgs[experimentName]) {
    return extend(inputArgs, fetchInputs(experimentSpecificInputArgs[experimentName]));
  }
  return inputArgs;
};

export default { registerExperimentInput, getExperimentInputs };
