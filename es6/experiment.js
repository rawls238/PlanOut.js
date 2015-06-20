import Assignment from './assignment';
import { clone, extend, isObject, forEach } from './lib/utils';

class Experiment {
  constructor(inputs) {
    this.loggerConfigured = false;
    this.inputs = inputs;
    this._exposureLogged = false;
    this._salt = null;
    this._inExperiment = true;

    this.name = this.getDefaultExperimentName();
    this._autoExposureLog = true;

    this.setup();

    this._assignment = new Assignment(this.getSalt());
    this._assigned = false; 
  }


  //helper function to return the class name of the current experiment class
  getDefaultExperimentName() {
    if (isObject(this) && this.constructor && this !== this.window) {
      var arr = this.constructor.toString().match(/function\s*(\w+)/);
      if (arr && arr.length === 2) {
        return arr[1];
      }
    }
    return "GenericExperiment";
  }


  requireAssignment() {
    if (!this._assigned) {
      this._assign();
    }
  }

  requireExposureLogging() {
    if (this._autoExposureLog && !this._exposureLogged) {
      this.logExposure();
    }
  }

  _assign() {
    this.configureLogger();
    this.assign(this._assignment, this.inputs);
    this._assigned = true;
  }

  setup() {
    return;
  }

  inExperiment() {
    return this._inExperiment;
  }

  setOverrides(value) {
    this._assignment.setOverrides(value);
    var o = this._assignment.getOverrides();
    var self = this;
    forEach(Object.keys(o), function(key) {
      if (self.inputs[key] !== undefined) {
        self.inputs[key] = o[key];
      }
    });
  }

  getSalt() {
    if (this._salt) {
      return this._salt;
    } else {
      return this.name;
    }
  }

  setSalt(value) {
    this._salt = value;
    if(this._assignment) {
      this._assignment.experimentSalt = value;
    }
  }

  getName() {
    return this._name;
  }

  assign(params, args) {
    throw "IMPLEMENT THIS";
  }

  setName(value) {
    var re = /\s+/g; 
    var name = value.replace(re, '-');
    this._name = name;
    if (this._assignment) {
      this._assignment.experimentSalt = this.getSalt();
    }
  }

  __asBlob(extras={}) {
    var d = { 
      'name': this.getName(),
      'time': new Date().getTime() / 1000,
      'salt': this.getSalt(),
      'inputs': this.inputs,
      'params': this._assignment.getParams()
    };
    extend(d, extras);
    return d;
  }

  setAutoExposureLogging(value) {
    this._autoExposureLog = value;
  }

  getParams() {
    this.requireAssignment();
    this.requireExposureLogging();
    return this._assignment.getParams();
  }

  get(name, def) {
    this.requireAssignment();
    this.requireExposureLogging();
    return this._assignment.get(name, def);
  }

  toString() {
    this.requireAssignment();
    this.requireExposureLogging();
    return JSON.stringify(this.__asBlob());
  }

  logExposure(extras) {
    if (!this._inExperiment) {
      return;
    }
    this._exposureLogged = true;
    this.logEvent('exposure', extras);
  }

  logEvent(eventType, extras) {
    if (!this._inExperiment) {
      return;
    }

    var extraPayload;

    if(extras) {
      extraPayload = { 'event': eventType, 'extra_data': clone(extras)};
    } else {
      extraPayload = { 'event': eventType };
    }

    this.log(this.__asBlob(extraPayload));
  }

  configureLogger() {
    throw "IMPLEMENT THIS";
  }

  log(data) {
    throw "IMPLEMENT THIS";
  }

  previouslyLogged() {
    throw "IMPLEMENT THIS";
  }
}

export default Experiment;
