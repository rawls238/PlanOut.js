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
