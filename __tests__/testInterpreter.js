var Interpreter = require('../es6/interpreter');
var ExperimentSetup = require('../es6/experimentSetup');
var PlanOutOpCommutative = require('../es6/ops/base').PlanOutOpCommutative;

class CustomOp extends PlanOutOpCommutative {
  commutativeExecute(values) {
    var value = 0;
    for (var i = 0; i < values.length; i++) {
      value += values[i];
    }
    return value;
  }
}

var compiled = 
{"op":"seq","seq":[{"op":"set","var":"group_size","value":{"choices":{"op":"array","values":[1,10]},"unit":{"op":"get","var":"userid"},"op":"uniformChoice"}},{"op":"set","var":"specific_goal","value":{"p":0.8,"unit":{"op":"get","var":"userid"},"op":"bernoulliTrial"}},{"op":"cond","cond":[{"if":{"op":"get","var":"specific_goal"},"then":{"op":"seq","seq":[{"op":"set","var":"ratings_per_user_goal","value":{"choices":{"op":"array","values":[8,16,32,64]},"unit":{"op":"get","var":"userid"},"op":"uniformChoice"}},{"op":"set","var":"ratings_goal","value":{"op":"product","values":[{"op":"get","var":"group_size"},{"op":"get","var":"ratings_per_user_goal"}]}}]}}]}]};
var interpreterSalt = 'foo';

describe("Test interpreter", function() {
  beforeEach(() => {
    ExperimentSetup.toggleCompatibleHash(true);
  });

  it('should interpret properly', function() {
    var proc = new Interpreter(compiled, interpreterSalt, { 'userid': 123454});
    expect(proc.getParams().specific_goal).toEqual(1);
    expect(proc.getParams().ratings_goal).toEqual(320);
  });
  
  it('should allow overrides', function() {
    var proc = new Interpreter(compiled, interpreterSalt, { 'userid': 123454});
    proc.setOverrides({'specific_goal': 0});
    expect(proc.getParams().specific_goal).toEqual(0);
    expect(proc.getParams().ratings_goal).toEqual(undefined);

    proc = new Interpreter(compiled, interpreterSalt, { 'userid': 123453});
    proc.setOverrides({'userid': 123454});
    expect(proc.getParams().specific_goal).toEqual(1);
  });

  it('should correctly handle non-truthy input values', function() {
    var script = {
      op: 'seq',
      seq: [
        {
          op: 'set',
          var: 'num_of_categories',
          value: {
            choices: {
              op: 'array',
              values: [1, 5, 10],
            },
            unit: {
              op: 'get',
              var: 'userid',
            },
            op: 'uniformChoice',
          },
        },
      ],
    };
    var proc = new Interpreter(script, 'exp0', { userid: 0 });
    expect(proc.getParams()['num_of_categories']).not.toBeUndefined();
  });

  it('should register custom ops', function() {
    var customOpScript = {"op":"seq","seq":[{"op":"set","var":"x","value":{"values":[2,4],"op":"customOp"}}]};
    var proc = new Interpreter(customOpScript, interpreterSalt, { userId: 123454 });
    proc.registerCustomOperators({ 'customOp': CustomOp });
    expect(proc.getParams()['x']).toEqual(6);
  })
});
