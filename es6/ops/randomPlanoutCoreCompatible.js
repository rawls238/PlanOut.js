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

var WeightedChoiceCoreCompatible = WeightedChoiceBuilder(PlanOutOpRandomCoreCompatible);
var BernoulliFilterCoreCompatible = BernoulliFilterBuilder(PlanOutOpRandomCoreCompatible);
var BernoulliTrialCoreCompatible = BernoulliTrialBuilder(PlanOutOpRandomCoreCompatible);
var RandomFloatCoreCompatible = RandomFloatBuilder(PlanOutOpRandomCoreCompatible);

export {
  PlanOutOpRandomCoreCompatible as PlanOutOpRandom,
  SampleCoreCompatible as Sample,
  WeightedChoiceCoreCompatible as WeightedChoice,
  UniformChoiceCoreCompatible as UniformChoice,
  BernoulliFilterCoreCompatible as BernoulliFilter,
  BernoulliTrialCoreCompatible as BernoulliTrial,
  RandomIntegerCoreCompatible as RandomInteger,
  RandomFloatCoreCompatible as RandomFloat
};
