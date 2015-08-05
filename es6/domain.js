import {Namespace, SimpleNamespace} from './namespace';

class Domain {

  cohorts() {
    throw "IMPLEMENT cohorts";
  }

  addExperiment(name, obj, segments, cohorts) {
    throw "IMPLEMENT addExperiment";
  }

  removeExperiment(name) {
    throw "IMPLEMENT removeExperiment";
  }

  setAutoExposureLogging(value) {
    throw "IMPLEMENT setAutoExposureLogging";
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

  namespaceFactory(name) {
    throw "IMPLEMENT namespaceFactory"
  }
}

class SimpleDomain extends Domain {

  constructor(args) {
    super(args);
    this.namespaces = {}
  }

  setup(name) {
    throw "IMPLEMENT setup";
  }

  setupExperiments() {
    throw "IMPLEMENT setupExperiments";
  }


  namespaceFactory(name) {
    class NamespaceFactory extends SimpleNamespace {
      setup() {
        this.setup(name);
      }

      setupExperiments() {
        this.setupExperiments(name);
      }
    }
  }

}