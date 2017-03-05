import { PlanOutOpSimple } from "./base";
import sha1 from "sha1";
import { shallowCopy, reduce, isArray } from "../lib/utils";

class PlanOutOpRandom extends PlanOutOpSimple {

  constructor(args) {
    super(args);
    this.LONG_SCALE = 0xFFFFFFFFFFFFF;
  }

  compatHashCalculation(hash) {
    return parseInt(hash.substr(0, 13), 16);
  }

  compatZeroToOneCalculation(appendedUnit) {
    return this.getHash(appendedUnit) / this.LONG_SCALE;
  }

  getUnit(appendedUnit) {
    var unit = this.getArgMixed('unit');
    if (!isArray(unit)) {
      unit = [unit];
    }
    if (appendedUnit) {
      unit.push(appendedUnit);
    }
    return unit;
  }

  getUniform(minVal=0.0, maxVal=1.0, appendedUnit) {
    var zeroToOne = this.compatZeroToOneCalculation(appendedUnit);
    return zeroToOne * (maxVal - minVal) + (minVal);
  }

  getHash(appendedUnit) {
    var fullSalt;
    if (this.args.full_salt) {
      fullSalt = this.getArgString('full_salt') + '.';
    } else {
      var salt = this.getArgString('salt');
      fullSalt = this.mapper.get('experimentSalt') + '.' + salt + this.mapper.get('saltSeparator');
    }


    var unitStr = this.getUnit(appendedUnit).map(element =>
      String(element)
    ).join('.');
    var hashStr = fullSalt + unitStr;
    var hash = sha1(hashStr);
    return this.compatHashCalculation(hash);
  }
}

const RandomFloatBuilder = (RandomOpsClass) => class extends RandomOpsClass {
  simpleExecute() {
    var minVal = this.getArgNumber('min');
    var maxVal = this.getArgNumber('max');
    return this.getUniform(minVal, maxVal);
  }
}

const RandomIntegerBuilder = (RandomOpsClass) => class extends RandomOpsClass {
  compatRandomIntegerCalculation(minVal, maxVal) {
    return (this.getHash() + minVal) % (maxVal - minVal + 1);
  }

  simpleExecute() {
    var minVal = this.getArgNumber('min');
    var maxVal = this.getArgNumber('max');
    return this.compatRandomIntegerCalculation(minVal, maxVal);
  }
}

const BernoulliTrialBuilder = (RandomOpsClass) => class extends RandomOpsClass {
  simpleExecute() {
    var p = this.getArgNumber('p');
    if (p < 0 || p > 1) {
      throw "Invalid probability";
    }

    if (this.getUniform(0.0, 1.0) <= p) {
      return 1;
    } else {
      return 0;
    }
  }
}

const BernoulliFilterBuilder = (RandomOpsClass) => class extends RandomOpsClass {
  simpleExecute() {
    var p = this.getArgNumber('p');
    var values = this.getArgList('choices');
    if (p < 0 || p > 1) {
      throw "Invalid probability";
    }
    if (values.length == 0) {
      return [];
    }
    var ret = [];
    for (var i = 0; i < values.length; i++) {
      var cur = values[i];
      if (this.getUniform(0.0, 1.0, cur) <= p) {
        ret.push(cur);
      }
    }
    return ret;
  }
}

const UniformChoiceBuilder = (OpRandomClass) => class extends OpRandomClass {
  compatRandomIndexCalculation(choices) {
    return this.getHash() % (choices.length);
  }

  simpleExecute() {
    var choices = this.getArgList('choices');
    if (choices.length === 0) {
      return [];
    }
    var randIndex = this.compatRandomIndexCalculation(choices);
    return choices[randIndex];
  }
}

const WeightedChoiceBuilder = (RandomOpsClass) => class extends RandomOpsClass {
  simpleExecute() {
    var choices = this.getArgList('choices');
    var weights = this.getArgList('weights');
    if (choices.length === 0) {
      return [];
    }
    var cumSum = 0;
    var cumWeights = weights.map(function(weight) {
      cumSum += weight;
      return cumSum;
    });
    var stopVal = this.getUniform(0.0, cumSum);
    for (var i = 0; i < cumWeights.length; ++i) {
      if (stopVal <= cumWeights[i]) {
        return choices[i];
      }
    }
  }
}


const SampleBuilder = (RandomOpsClass) => class extends RandomOpsClass {
  compatSampleIndexCalculation(i) {
    return this.getHash(i) % (i+1);
  }

  compatAllowSampleStoppingPoint() {
    return true;
  }

  sample(array, numDraws) {
    var len = array.length;
    var stoppingPoint = len - numDraws;
    var allowStoppingPoint = this.compatAllowSampleStoppingPoint();

    for (var i = len - 1; i > 0; i--) {
      var j = this.compatSampleIndexCalculation(i);

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;

      if (allowStoppingPoint && stoppingPoint === i) {
        return array.slice(i, len);
      }
    }
    return array.slice(0, numDraws);
  }

  simpleExecute() {
    var choices = shallowCopy(this.getArgList('choices'));
    var numDraws = 0;
    if (this.args.draws !== undefined) {
      numDraws = this.getArgNumber('draws');
    } else {
      numDraws = choices.length;
    }
    return this.sample(choices, numDraws);
  }
}

export default {
  PlanOutOpRandom,
  SampleBuilder,
  Sample: SampleBuilder(PlanOutOpRandom),
  WeightedChoiceBuilder,
  WeightedChoice: WeightedChoiceBuilder(PlanOutOpRandom),
  UniformChoiceBuilder,
  UniformChoice: UniformChoiceBuilder(PlanOutOpRandom),
  BernoulliFilterBuilder,
  BernoulliFilter: BernoulliFilterBuilder(PlanOutOpRandom),
  BernoulliTrialBuilder,
  BernoulliTrial: BernoulliTrialBuilder(PlanOutOpRandom),
  RandomIntegerBuilder,
  RandomInteger: RandomIntegerBuilder(PlanOutOpRandom),
  RandomFloatBuilder,
  RandomFloat: RandomFloatBuilder(PlanOutOpRandom)
};
