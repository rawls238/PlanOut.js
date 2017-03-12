import { isObject, forEach } from '../lib/utils';

var initializeOperators = function(Core, Random) {
  registerOperators({
    'literal': Core.Literal,
    'get': Core.Get,
    'set': Core.Set,
    'seq': Core.Seq,
    'return': Core.Return,
    'index': Core.Index,
    'array': Core.Arr,
    'equals': Core.Equals,
    'and': Core.And,
    'or': Core.Or,
    ">": Core.GreaterThan,
    "<": Core.LessThan,
    ">=": Core.GreaterThanOrEqualTo,
    "<=": Core.LessThanOrEqualTo,
    "%": Core.Mod,
    "/": Core.Divide,
    "not": Core.Not,
    "round": Core.Round,
    "negative": Core.Negative,
    "min": Core.Min,
    "max": Core.Max,
    "length": Core.Length,
    "coalesce": Core.Coalesce,
    "map": Core.Map,
    "cond": Core.Cond,
    "product": Core.Product,
    "sum": Core.Sum,
    "randomFloat": Random.RandomFloat,
    "randomInteger": Random.RandomInteger,
    "bernoulliTrial": Random.BernoulliTrial,
    "bernoulliFilter": Random.BernoulliFilter,
    "uniformChoice": Random.UniformChoice,
    "weightedChoice": Random.WeightedChoice,
    "sample": Random.Sample
  });
}

var operators = {};

var registerOperators = function (ops) {
  forEach(ops, function (value, op) {
    if (operators[op]) {
      throw `${op} already is defined`;
    } else {
      operators[op] = value;
    }
  });
}

var isOperator = function(op) {
  return isObject(op) && op.op;
}

var operatorInstance = function (params) {
  var op = params.op;
  if (!operators[op]) {
    throw `Unknown Operator ${op}`;
  }

  return new operators[op](params);
}

class StopPlanOutException {
  constructor(inExperiment) {
    this.inExperiment = inExperiment;
  }
}

export { initializeOperators, registerOperators, isOperator, operatorInstance, StopPlanOutException };
