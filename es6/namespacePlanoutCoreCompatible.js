import { Namespace, SimpleNamespace } from "./namespace.js";
import Assignment from "./assignment.js";
import { Sample, RandomInteger } from "./ops/randomPlanoutCoreCompatible.js";

class SimpleNamespacePlanoutCoreCompatible extends SimpleNamespace {
  _SampleClass() {
    return Sample;
  }

  _RandomIntegerClass() {
    return RandomInteger;
  }
}

export default {
  Namespace: Namespace,
  SimpleNamespace: SimpleNamespacePlanoutCoreCompatible
};
