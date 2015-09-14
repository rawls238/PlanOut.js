var Interpreter = require('../es6/interpreter');
var UniformChoice = require('../es6/ops/random').UniformChoice;
var Experiment = require('../es6/experiment');

var globalLog = [];

class BaseExperiment extends Experiment {
  configureLogger() {
    return;
  }
  log(stuff) {
    globalLog.push(stuff);
  }
  previouslyLogged() {
    return;
  }

  getParamNames() {
    return this.getDefaultParamNames();
  }
  setup() {
    this.name = 'test_name';
  }
}

describe("Test the experiment module", function() {
  var validateLog;
  var experimentTester;
  beforeEach(function() {
    validateLog = function (blob, expectedFields) {
      if (!expectedFields || !blob) { return; }
      Object.keys(expectedFields).forEach(function(field) {
        expect(blob[field]).not.toBe(undefined);
        if (expectedFields[field] !== undefined) {
          validateLog(blob[field], expectedFields[field]);
        }
      });
    };

    experimentTester = function (expClass, inExperiment=true) {
      globalLog = [];
      var e = new expClass({ 'i': 42});
      e.setOverrides({'bar': 42});
      var params = e.getParams();

      expect(params['foo']).not.toBe(undefined);
      expect(params['foo']).toEqual('b');
      expect(params['bar']).toEqual(42);

      if (inExperiment) {
        expect(globalLog.length).toEqual(1);
        validateLog(globalLog[0], { 
          'inputs': { 'i': null },
          'params': { 'foo': null, 'bar': null}
        });
      } else {
        expect(globalLog.length).toEqual(0);
      }

      expect(e.inExperiment(), inExperiment);
    };
  });

  it('should work with basic experiments', function() {
    class TestVanillaExperiment extends BaseExperiment {
      assign(params, args) {
        params.set('foo', new UniformChoice({'choices': ['a', 'b'], 'unit': args.i}));
      }
    }
    experimentTester(TestVanillaExperiment);
  });

  it('should be able to disable an experiment', function() {
    class TestVanillaExperiment extends BaseExperiment {
      assign(params, args) {
        params.set('foo', new UniformChoice({'choices': ['a', 'b'], 'unit': args.i}));
        return false;
      }
    }
    experimentTester(TestVanillaExperiment, false);
  });

  it('should only assign once', function() {

    class TestSingleAssignment extends BaseExperiment {
      assign(params, args) {
        params.set('foo', new UniformChoice({'choices': ['a', 'b'], 'unit': args.i}));
        var counter = args.counter;
        if (!counter.count) { counter.count = 0; }
        counter.count = counter.count + 1;
      }
    }

    var assignment_count = {'count': 0};
    var e = new TestSingleAssignment({'i': 10, 'counter': assignment_count});
    expect(assignment_count.count).toEqual(0);
    e.get('foo');
    expect(assignment_count.count).toEqual(1);
    e.get('foo');
    expect(assignment_count.count).toEqual(1);
  });

  it('should be able to pull experiment parameters', function() {
    class TestAssignmentRetrieval extends BaseExperiment {
      assign(params, args) {
        params.set('foo', 'heya');
        if (false) {
          params.set('boo', 'hey');
        }
      }
    }

    class TestAssignmentRetrieval2 extends BaseExperiment {
      assign(params, args) {
        return;
      }
    }

    var e = new TestAssignmentRetrieval();
    expect(e.getParamNames()).toEqual(['foo', 'boo']);
    var f = new TestAssignmentRetrieval2();
    expect(f.getParamNames()).toEqual([]);
  });

  it('should work with an interpreted experiment', function() {
    class TestInterpretedExperiment extends BaseExperiment {
      assign(params, args) {
        var compiled = 
          {"op":"seq",
           "seq": [
            {"op":"set",
             "var":"foo",
             "value":{
               "choices":["a","b"],
               "op":"uniformChoice",
               "unit": {"op": "get", "var": "i"}
               }
            },
            {"op":"set",
             "var":"bar",
             "value": 41
            }
          ]};
        var proc = new Interpreter(compiled, this.getSalt(), args, params);
        var par = proc.getParams();
        Object.keys(par).forEach(function(param) {
          params.set(param, par[param]);
        });
      }
    };
    experimentTester(TestInterpretedExperiment);
  });
});
