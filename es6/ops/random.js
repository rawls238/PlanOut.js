import {
  PlanOutOpRandomBase,
  SampleBuilder,
  WeightedChoiceBuilder,
  UniformChoiceBuilder,
  BernoulliFilterBuilder,
  BernoulliTrialBuilder,
  RandomIntegerBuilder,
  RandomFloatBuilder
} from "./randomBase";

class PlanOutOpRandom extends PlanOutOpRandomBase {

  constructor(args) {
    super(args);
    this.LONG_SCALE = 0xFFFFFFFFFFFFF;
  }

  hashCalculation(hash) {
    return parseInt(hash.substr(0, 13), 16);
  }

  zeroToOneCalculation(appendedUnit) {
    return this.getHash(appendedUnit) / this.LONG_SCALE;
  }
}

var Sample = SampleBuilder(PlanOutOpRandom);
var WeightedChoice = WeightedChoiceBuilder(PlanOutOpRandom);
var UniformChoice = UniformChoiceBuilder(PlanOutOpRandom);
var BernoulliFilter = BernoulliFilterBuilder(PlanOutOpRandom);
var BernoulliTrial = BernoulliTrialBuilder(PlanOutOpRandom);
var RandomInteger = RandomIntegerBuilder(PlanOutOpRandom);
var RandomFloat = RandomFloatBuilder(PlanOutOpRandom);

export {
  PlanOutOpRandom,
  Sample,
  WeightedChoice,
  UniformChoice,
  BernoulliFilter,
  BernoulliTrial,
  RandomInteger,
  RandomFloat
};
