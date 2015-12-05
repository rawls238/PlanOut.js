import Experiment from "./experiment.js";
import Assignment from "./assignment.js";
import { Sample, RandomInteger } from "./ops/random.js";
import { range, isObject, forEach, getParameterByName, hasKey, extend } from "./lib/utils.js";
import { getExperimentInputs } from './experimentSetup';


class DefaultExperiment extends Experiment {
  configureLogger() {
    return;
  }

  setup() {
    this._name = 'test_name';
  }

  log(data) {
    return;
  }

  getParamNames() {
    return this.getDefaultParamNames();
  }

  previouslyLogged() {
    return true;
  }

  assign(params, args) {
    return;
  }
}

class Namespace {

  addExperiment(name, obj, segments) {
    throw "IMPLEMENT addExperiment";
  }

  removeExperiment(name) {
    throw "IMPLEMENT removeExperiment";
  }

  setAutoExposureLogging(value) {
    throw "IMPLEMENT setAutoExposureLogging";
  }

  inExperiment() {
    throw "IMPLEMENT inExperiment";
  }

  get(name, defaultVal) {
    throw "IMPLEMENT get";
  }

  logExposure(extras) {
    throw "IMPLEMENT logExposure";
  }

  logEvent(eventType, extras) {
    throw "IMPLEMENT logEvent";
  }

  requireExperiment() {
    if (!this._experiment) {
      this._assignExperiment();
    }
  }

  requireDefaultExperiment() {
    if (!this._defaultExperiment) {
      this._assignDefaultExperiment();
    }
  }
}

class SimpleNamespace extends Namespace {
  
  constructor(args) {
    super(args);
    this.setName(this.getDefaultNamespaceName());
    this.inputs = args || {};
    this.numSegments = 1;
    this.segmentAllocations = {};
    this.currentExperiments = {};

    this._experiment = null;
    this._defaultExperiment = null;
    this.defaultExperimentClass = DefaultExperiment
    this._inExperiment = false;

    this.setupDefaults();
    this.setup();
    this.availableSegments = range(this.numSegments);

    this.setupExperiments();
  }

  setupDefaults() {
    return;
  }

  setup() {
    throw "IMPLEMENT setup";
  }

  setupExperiments() {
    throw "IMPLEMENT setupExperiments";
  }

  getPrimaryUnit() {
    return this._primaryUnit;
  }

  allowedOverride() {
    return false;
  }

  getOverrides() {
    return {};
  }

  setPrimaryUnit(value) {
    this._primaryUnit = value;
  }

  addExperiment(name, expObject, segments) {
    var numberAvailable = this.availableSegments.length;
    if (numberAvailable < segments) {
      return false;
    } else if (this.currentExperiments[name] !== undefined) {
      return false;
    }
    var a = new Assignment(this.getName());
    a.set('sampled_segments', new Sample({'choices': this.availableSegments, 'draws': segments, 'unit': name}));
    var sample = a.get('sampled_segments');
    for(var i = 0; i < sample.length; i++) {
      this.segmentAllocations[sample[i]] = name;
      var currentIndex = this.availableSegments.indexOf(sample[i]);
      this.availableSegments[currentIndex] = this.availableSegments[numberAvailable - 1];
      this.availableSegments.splice(numberAvailable - 1, 1);
      numberAvailable -= 1;
    }
    this.currentExperiments[name] = expObject
    
  }

  removeExperiment(name) {
    if (this.currentExperiments[name] === undefined) {
      return false;
    }

    forEach(Object.keys(this.segmentAllocations), (cur) => {
      if(this.segmentAllocations[cur] === name) {
        delete this.segmentAllocations[cur];
        this.availableSegments.push(cur);
      }
    });

    delete this.currentExperiments[name];
    return true;
  }

  getSegment() {
    var a = new Assignment(this.getName());
    var segment = new RandomInteger({'min': 0, 'max': this.numSegments-1, 'unit': this.inputs[this.getPrimaryUnit()]});
    a.set('segment', segment);
    return a.get('segment');
  }

  _assignExperiment() {
    this.inputs = extend(this.inputs, getExperimentInputs(this.getName()));
    var segment = this.getSegment();

    if (this.segmentAllocations[segment] !== undefined) {
      var experimentName = this.segmentAllocations[segment];
      this._assignExperimentObject(experimentName);
    }
  }

  _assignExperimentObject(experimentName) {
    var experiment = new this.currentExperiments[experimentName](this.inputs);
    experiment.setName(`${this.getName()}-${experimentName}`);
    experiment.setSalt(`${this.getName()}-${experimentName}`);
    this._experiment = experiment;
    this._inExperiment = experiment.inExperiment();
    if (!this._inExperiment) {
      this._assignDefaultExperiment();
    }
  }

  _assignDefaultExperiment() {
    this._defaultExperiment = new this.defaultExperimentClass(this.inputs);
  }

  defaultGet(name, default_val) {
    super.requireDefaultExperiment();
    return this._defaultExperiment.get(name, default_val);
  }

  getName() {
    return this._name;
  }

  setName(name) {
    this._name = name;
  }

  previouslyLogged() {
    if (this._experiment) {
      return this._experiment.previouslyLogged();
    }
    return null;
  }

  inExperiment() {
    super.requireExperiment();
    return this._inExperiment;
  }

  setAutoExposureLogging(value) {
    this._autoExposureLoggingSet = value;
    if (this._defaultExperiment) {
      this._defaultExperiment.setAutoExposureLogging(value);
    }
    if (this._experiment) {
      this._experiment.setAutoExposureLogging(value);
    }
  }

  setGlobalOverride(name) {
    var globalOverrides = this.getOverrides();
    if(globalOverrides && hasKey(globalOverrides, name)) {
      var overrides = globalOverrides[name];
      if (overrides && hasKey(this.currentExperiments, overrides.experimentName)) {
        this._assignExperimentObject(overrides.experimentName);
        this._experiment.addOverride(name, overrides.value);
      }
    }
  }

  setLocalOverride(name) {
    var experimentName = getParameterByName('experimentOverride');
    if (experimentName && hasKey(this.currentExperiments, experimentName)) {
      this._assignExperimentObject(experimentName);
      if (getParameterByName(name)) {
        this._experiment.addOverride(name, getParameterByName(name));
      }
    }
  }

  getParams(experimentName) {
    super.requireExperiment();
    if (this._experiment && this.getOriginalExperimentName() === experimentName) {
      return this._experiment.getParams();
    } else {
      return null;
    }
  }

  getOriginalExperimentName() {
    if (this._experiment) {
      return this._experiment.getName().split('-')[1];
    }
    return null;
  }

  get(name, defaultVal) {
    super.requireExperiment();
    if (this.allowedOverride()) {
      this.setGlobalOverride(name);
    }
    this.setLocalOverride(name);

    if (!this._experiment) {
      return this.defaultGet(name, defaultVal);
    } else {
      if (this._autoExposureLoggingSet !== undefined) {
        this._experiment.setAutoExposureLogging(this._autoExposureLoggingSet);
      }
      return this._experiment.get(name, this.defaultGet(name, defaultVal));
    }
  }

  logExposure(extras) {
    super.requireExperiment();
    if (!this._experiment) {
      return;
    }
    this._experiment.logExposure(extras);
  }

  logEvent(eventType, extras) {
    super.requireExperiment();
    if (!this._experiment) {
      return;
    }
    this._experiment.logEvent(eventType, extras);
  }

  //helper function to return the class name of the current experiment class
  getDefaultNamespaceName() {
    if (isObject(this) && this.constructor && this !== this.window) {
      var arr = this.constructor.toString().match(/function\s*(\w+)/);
      if (arr && arr.length === 2) {
        return arr[1];
      }
    }
    return "GenericNamespace";
  }
}

export { Namespace, SimpleNamespace }
