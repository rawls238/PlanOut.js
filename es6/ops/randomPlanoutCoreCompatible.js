import {
  PlanOutOpRandom,
  Sample,
  SampleBuilder,
  WeightedChoice,
  WeightedChoiceBuilder,
  UniformChoice,
  UniformChoiceBuilder,
  BernoulliFilter,
  BernoulliFilterBuilder,
  BernoulliTrial,
  BernoulliTrialBuilder,
  RandomInteger,
  RandomIntegerBuilder,
  RandomFloat,
  RandomFloatBuilder
} from "./random";
import BigNumber from "bignumber.js";

class PlanOutOpRandomCoreCompatible extends PlanOutOpRandom {
  constructor(args) {
    super(args);
    this.LONG_SCALE = new BigNumber("FFFFFFFFFFFFFFF", 16);
  }

  compatHashCalculation(hash) {
    return new BigNumber(hash.substr(0, 15), 16);
  }

  compatZeroToOneCalculation(appendedUnit) {
    return this.getHash(appendedUnit).dividedBy(this.LONG_SCALE).toNumber();
  }
}

class RandomIntegerCoreCompatible extends RandomIntegerBuilder(PlanOutOpRandomCoreCompatible) {
  compatRandomIntegerCalculation(minVal, maxVal) {
    return this.getHash().plus(minVal).modulo(maxVal - minVal + 1).toNumber();
  }
}

class UniformChoiceCoreCompatible extends UniformChoiceBuilder(PlanOutOpRandomCoreCompatible) {
  compatRandomIndexCalculation(choices) {
    return this.getHash().modulo(choices.length).toNumber();
  }
}

class SampleCoreCompatible extends SampleBuilder(PlanOutOpRandomCoreCompatible) {
  compatSampleIndexCalculation(i) {
    return this.getHash(i).modulo(i+1).toNumber();
  }

  compatAllowSampleStoppingPoint() {
    return false;
  }
}

export default {
  PlanOutOpRandom: PlanOutOpRandomCoreCompatible,
  Sample: SampleCoreCompatible,
  WeightedChoice: WeightedChoiceBuilder(PlanOutOpRandomCoreCompatible),
  UniformChoice: UniformChoiceCoreCompatible,
  BernoulliFilter: BernoulliFilterBuilder(PlanOutOpRandomCoreCompatible),
  BernoulliTrial: BernoulliTrialBuilder(PlanOutOpRandomCoreCompatible),
  RandomInteger: RandomIntegerCoreCompatible,
  RandomFloat: RandomFloatBuilder(PlanOutOpRandomCoreCompatible)
};
