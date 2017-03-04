import { Namespace, SimpleNamespace } from "./namespace.js";
import Assignment from "./assignment.js";
import { Sample, RandomInteger } from "./ops/randomPlanoutCoreCompatible.js";

class SimpleNamespacePlanoutCoreCompatible extends SimpleNamespace {

  addExperiment(name, expObject, segments) {
    var numberAvailable = this.availableSegments.length;
    if (numberAvailable < segments) {
      return false;
    } else if (this.currentExperiments[name] !== undefined) {
      return false;
    }
    var a = new Assignment(this.name);
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

  getSegment() {
    var a = new Assignment(this.name);
    var segment = new RandomInteger({'min': 0, 'max': this.numSegments-1, 'unit': this.inputs[this.getPrimaryUnit()]});
    a.set('segment', segment);
    return a.get('segment');
  }
}

export default {
  Namespace: Namespace,
  SimpleNamespace: SimpleNamespacePlanoutCoreCompatible
};
