import * as core from './core';
import * as random from './random';
import { isObject } from '../lib/utils';

var initFactory = function() {
  return {
    'literal': core.Literal,
    'get': core.Get,
    'set': core.Set,
    'seq': core.Seq,
    'return': core.Return,
    'index': core.Index,
    'array': core.Arr,
    'equals': core.Equals,
    'and': core.And,
    'or': core.Or,
    ">": core.GreaterThan,
    "<": core.LessThan,
    ">=": core.GreaterThanOrEqualTo,
    "<=": core.LessThanOrEqualTo,
    "%": core.Mod,
    "/": core.Divide,
    "not": core.Not,
    "round": core.Round,
    "negative": core.Negative,
    "min": core.Min,
    "max": core.Max,
    "length": core.Length,
    "coalesce": core.Coalesce,
    "cond": core.Cond,
    "product": core.Product,
    "sum": core.Sum,
    "randomFloat": random.RandomFloat,
    "randomInteger": random.RandomInteger,
    "bernoulliTrial": random.BernoulliTrial,
    "bernoulliFilter": random.BernoulliFilter,
    "uniformChoice": random.UniformChoice,
    "weightedChoice": random.WeightedChoice,
    "sample": random.Sample
  };
}


var operators = initFactory();

var isOperator = function(op) {
  return isObject(op) && op.op;
}

var operatorInstance = function (params) {
  var op = params.op;
  if (!operators[op]) {
    throw `Unknown Operator {op}`;
  }
  
  return new operators[op](params);
}


class StopPlanOutException {
  constructor(inExperiment) {
    this.inExperiment = inExperiment;
  }
}

export { initFactory, isOperator, operatorInstance, StopPlanOutException }
