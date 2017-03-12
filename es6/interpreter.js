import { shallowCopy, deepCopy, isObject, isArray, map } from "./lib/utils";

export default function provideInterpreter(OpsUtils, Assignment) {
  class Interpreter {
    constructor(serialization, experimentSalt='global_salt', inputs={}, environment) {
      this._serialization = deepCopy(serialization);
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
      if (inputVal === null || inputVal === undefined) {
        inputVal = defaultVal;
      }
      var envVal = this._env.get(name);
      if (envVal !== undefined && envVal !== null) {
        return envVal;
      }
      return inputVal;
    }

    getParams() {
      if (!this._evaluated) {
        try {
          this.evaluate(this._serialization);
        } catch(err) {
          if (err instanceof OpsUtils.StopPlanOutException) {
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

    getSaltSeparator() {
      return this._env.saltSeparator;
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

    registerCustomOperators(operators) {
      OpsUtils.registerOperators(operators);
    }

    evaluate(planoutCode) {
      if (isObject(planoutCode) && planoutCode.op) {
        return OpsUtils.operatorInstance(planoutCode).execute(this);
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

  return Interpreter;
}
