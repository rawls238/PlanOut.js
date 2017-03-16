import {
  PlanOutOpRandom,
  SampleBuilder,
  WeightedChoiceBuilder,
  UniformChoiceBuilder,
  BernoulliFilterBuilder,
  BernoulliTrialBuilder,
  RandomIntegerBuilder,
  RandomFloatBuilder
} from "./randomBase";
import BigNumber from "bignumber.js";

const LONG_SCALE = new BigNumber("FFFFFFFFFFFFFFF", 16);

class PlanOutOpRandomCoreCompatible extends PlanOutOpRandom {
  hashCalculation(hash) {
    return new BigNumber(hash.substr(0, 15), 16);
  }

  zeroToOneCalculation(appendedUnit) {
    return this.getHash(appendedUnit).dividedBy(LONG_SCALE).toNumber();
  }
}

class RandomIntegerCoreCompatible extends RandomIntegerBuilder(PlanOutOpRandomCoreCompatible) {
  randomIntegerCalculation(minVal, maxVal) {
    return this.getHash().plus(minVal).modulo(maxVal - minVal + 1).toNumber();
  }
}

class UniformChoiceCoreCompatible extends UniformChoiceBuilder(PlanOutOpRandomCoreCompatible) {
  randomIndexCalculation(choices) {
    return this.getHash().modulo(choices.length).toNumber();
  }
}

class SampleCoreCompatible extends SampleBuilder(PlanOutOpRandomCoreCompatible) {
  sampleIndexCalculation(i) {
    return this.getHash(i).modulo(i+1).toNumber();
  }

  allowSampleStoppingPoint() {
    return false;
  }
}

const WeightedChoiceCoreCompatible = WeightedChoiceBuilder(PlanOutOpRandomCoreCompatible);
const BernoulliFilterCoreCompatible = BernoulliFilterBuilder(PlanOutOpRandomCoreCompatible);
const BernoulliTrialCoreCompatible = BernoulliTrialBuilder(PlanOutOpRandomCoreCompatible);
const RandomFloatCoreCompatible = RandomFloatBuilder(PlanOutOpRandomCoreCompatible);

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
