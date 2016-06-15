import {
  PlanOutOpRandom,
  Sample,
  WeightedChoice,
  UniformChoice,
  BernoulliFilter,
  BernoulliTrial,
  RandomInteger,
  RandomFloat
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

class RandomIntegerCoreCompatible extends RandomInteger {
  compatRandomIntegerCalculation(minVal, maxVal) {
    return this.getHash().plus(minVal).modulo(maxVal - minVal + 1).toNumber();
  }
}

class UniformChoiceCoreCompatible extends UniformChoice {
  compatRandomIndexCalculation(choices) {
    this.getHash().modulo(choices.length).toNumber();
  }
}

class SampleCoreCompatible extends Sample {
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
  WeightedChoice,
  UniformChoice: UniformChoiceCoreCompatible,
  BernoulliFilter,
  BernoulliTrial,
  RandomInteger: RandomIntegerCoreCompatible,
  RandomFloat
};
