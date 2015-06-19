import Assignment from './assignment';
import { initFactory, operatorInstance, StopPlanOutException } from './ops/utils';
import { shallowCopy, deepCopy, isObject, isArray, map } from "./lib/utils";

class Interpreter {
  constructor(serialization, experimentSalt='global_salt', inputs={}, environment) {
    this._serialization = serialization;
    if (!environment) {
      this._env = new Assignment(experimentSalt);
    } else {
      this._env = environment;
    }
    this.experimentSalt = this._experimentSalt = experimentSalt;
    this._evaluated = false;
    this._inExperiment = false;
    this._inputs = shallowCopy(inputs);
  }

  inExperiment() {
    return this._inExperiment;
  }

  setEnv(newEnv) {
    this._env = deepCopy(newEnv);
    return this;
  }

  has(name) {
    return this._env[name];
  }

  get(name, defaultVal) {
    var inputVal = this._inputs[name];
    if (!inputVal) {
      inputVal = defaultVal;
    }
    var envVal = this._env.get(name);
    if (envVal) { 
      return envVal;
    }
    return inputVal;
  }

  getParams() {
    if (!this._evaluated) {
      try {
        this.evaluate(this._serialization);
      } catch(err) {
        if (err instanceof StopPlanOutException) {
          this._inExperiment = err.inExperiment;
        }
      }
      this._evaluated = true;
    }
    return this._env.getParams();
  }

  set(name, value) {
    this._env.set(name, value);
    return this;
  }

  setOverrides(overrides) {
    this._env.setOverrides(overrides);
    return this;
  }

  getOverrides() {
    return this._env.getOverrides();
  }

  hasOverride(name) {
    var overrides = this.getOverrides();
    return overrides && overrides[name] !== undefined;
  }

  evaluate(planoutCode) {
    if (isObject(planoutCode) && planoutCode.op) {
      return operatorInstance(planoutCode).execute(this);
    } else if (isArray(planoutCode)) {
      var self = this;
      return map(planoutCode, function(obj) {
        return self.evaluate(obj);
      });
    } else {
      return planoutCode;
    }
  }

}

export default Interpreter;
