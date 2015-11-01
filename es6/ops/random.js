import { PlanOutOpSimple } from "./base";
import sha1 from "sha1";
import { shallowCopy, reduce, isArray } from "../lib/utils";
import { usingCompatibleHash } from '../experimentSetup';

import BigNumber from "bignumber.js";


class PlanOutOpRandom extends PlanOutOpSimple {

  constructor(args) {
    super(args);
    this.LONG_SCALE_NON_COMPAT = 0xFFFFFFFFFFFFF;
    this.LONG_SCALE_COMPAT = new BigNumber("FFFFFFFFFFFFFFF", 16);
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
    var zeroToOne;
    if (usingCompatibleHash()) {
      zeroToOne = this.getHash(appendedUnit).dividedBy(this.LONG_SCALE_COMPAT).toNumber();
    } else {
      zeroToOne = this.getHash(appendedUnit) / this.LONG_SCALE_NON_COMPAT;
    }
    return zeroToOne * (maxVal - minVal) + (minVal);
  }

  getHash(appendedUnit) {
    var fullSalt;
    if (this.args.full_salt) {
      fullSalt = this.getArgString('full_salt');
    } else {
      var salt = this.getArgString('salt');
      fullSalt = this.mapper.get('experimentSalt') + "." + salt;
    }


    var unitStr = this.getUnit(appendedUnit).map(element =>
      String(element)
    ).join('.');
    var hashStr = fullSalt + "." + unitStr;
    var hash = sha1(hashStr);
    if (usingCompatibleHash()) {
      return new BigNumber(hash.substr(0, 15), 16);
    } else {
      return parseInt(hash.substr(0, 13), 16);
    }
  }
}

class RandomFloat extends PlanOutOpRandom {

  simpleExecute() {
    var minVal = this.getArgNumber('min');
    var maxVal = this.getArgNumber('max');
    return this.getUniform(minVal, maxVal);
  }
}

class RandomInteger extends PlanOutOpRandom {
  simpleExecute() {
    var minVal = this.getArgNumber('min');
    var maxVal = this.getArgNumber('max');
    if (usingCompatibleHash()) {
      return this.getHash().plus(minVal).modulo(maxVal - minVal + 1);
    } else {
      return this.getHash() + minVal % (maxVal - minVal + 1);
    }
  }
}

class BernoulliTrial extends PlanOutOpRandom {

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

class BernoulliFilter extends PlanOutOpRandom {
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

class UniformChoice extends PlanOutOpRandom {
  simpleExecute() {
    var choices = this.getArgList('choices');
    if (choices.length === 0) {
      return [];
    }
    var rand_index;
    if (usingCompatibleHash()) {
      rand_index = this.getHash().modulo(choices.length);
    } else {
      rand_index = this.getHash() % (choices.length);
    }
    return choices[rand_index];
  }
}

class WeightedChoice extends PlanOutOpRandom {
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
    return reduce(cumWeights, function(retVal, curVal, i) {
      if (retVal) {
        return retVal;
      }
      if (stopVal <= curVal) {
        return choices[i];
      }
      return retVal;
    }, null);
  }
}


class Sample extends PlanOutOpRandom {

  shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j;
      if (usingCompatibleHash()) {
        j = this.getHash(i).modulo(i+1).toNumber();
      } else {
        j = this.getHash(i) % (i+1);
      }

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  simpleExecute() {
    var choices = shallowCopy(this.getArgList('choices'));
    var numDraws = 0;
    if (this.args.draws !== undefined) {
      numDraws = this.getArgNumber('draws');
    } else {
      numDraws = choices.length;
    }
    var shuffledArr = this.shuffle(choices);
    return shuffledArr.slice(0, numDraws);
  }
}


export default {PlanOutOpRandom, Sample, WeightedChoice, UniformChoice, BernoulliFilter, BernoulliTrial, RandomInteger, RandomFloat };
