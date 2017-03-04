import { Namespace, SimpleNamespace } from "./namespace.js";
import Assignment from "./assignment.js";
import * as Random from "./ops/randomPlanoutCoreCompatible.js";

class SimpleNamespacePlanoutCoreCompatible extends SimpleNamespace {
  _Random() {
    return Random;
  }
}

export default {
  Namespace: Namespace,
  SimpleNamespace: SimpleNamespacePlanoutCoreCompatible
};
