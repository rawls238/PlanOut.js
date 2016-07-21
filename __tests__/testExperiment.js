var Interpreter = require.requireActual('../dist/planout.js').Interpreter;
var UniformChoice = require.requireActual('../dist/planout.js').Ops.Random.UniformChoice;
var Experiment = require.requireActual('../dist/planout.js').Experiment;
var InterpreterCompat = require.requireActual('../dist/planout_core_compatible.js').Interpreter;
var UniformChoiceCompat = require.requireActual('../dist/planout_core_compatible.js').Ops.Random.UniformChoice;
var ExperimentCompat = require.requireActual('../dist/planout_core_compatible.js').Experiment;

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

class BaseExperimentCompat extends ExperimentCompat {
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

    experimentTester = function (expClass, compat=false, inExperiment=true) {
      globalLog = [];
      var e = new expClass({ 'i': 42});
      e.setOverrides({'bar': 42});
      var params = e.getParams();

      if (compat) {
        expect(params['foo']).not.toBe(undefined);
        expect(params['foo']).toEqual('b');
        expect(params['bar']).toEqual(42);
      } else {
        expect(params['foo']).not.toBe(undefined);
        expect(params['foo']).toEqual('a');
        expect(params['bar']).toEqual(42);
      }

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

  it('should work with basic experiments (compat)', function() {
    class TestVanillaExperiment extends BaseExperimentCompat {
      assign(params, args) {
        params.set('foo', new UniformChoiceCompat({'choices': ['a', 'b'], 'unit': args.i}));
      }
    }
    experimentTester(TestVanillaExperiment, true);
  });

  it('should be able to disable an experiment', function() {
    class TestVanillaExperiment extends BaseExperiment {
      assign(params, args) {
        params.set('foo', new UniformChoice({'choices': ['a', 'b'], 'unit': args.i}));
        return false;
      }
    }
    experimentTester(TestVanillaExperiment, false, false);
  });

  it('should be able to disable an experiment (compat)', function() {
    class TestVanillaExperiment extends BaseExperimentCompat {
      assign(params, args) {
        params.set('foo', new UniformChoiceCompat({'choices': ['a', 'b'], 'unit': args.i}));
        return false;
      }
    }
    experimentTester(TestVanillaExperiment, true, false);
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

  it('should only assign once (compat)', function() {

    class TestSingleAssignment extends BaseExperimentCompat {
      assign(params, args) {
        params.set('foo', new UniformChoiceCompat({'choices': ['a', 'b'], 'unit': args.i}));
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

  it('should be able to pull experiment parameters (compat)', function() {
    class TestAssignmentRetrieval extends BaseExperimentCompat {
      assign(params, args) {
        params.set('foo', 'heya');
        if (false) {
          params.set('boo', 'hey');
        }
      }
    }

    class TestAssignmentRetrieval2 extends BaseExperimentCompat {
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

  it('should work with an interpreted experiment (compat)', function() {
    class TestInterpretedExperiment extends BaseExperimentCompat {
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
        var proc = new InterpreterCompat(compiled, this.getSalt(), args, params);
        var par = proc.getParams();
        Object.keys(par).forEach(function(param) {
          params.set(param, par[param]);
        });
      }
    };
    experimentTester(TestInterpretedExperiment);
  });

  it('should not log exposure if "get" is called on a param not in the experiment', function() {
    class TestVanillaExperiment extends BaseExperiment {
      assign(params, args) {
        params.set('foo', new UniformChoice({'choices': ['a', 'b'], 'unit': args.i}));
      }
    }
    globalLog = [];
    var e = new TestVanillaExperiment({ 'i': 42});
    e.get('fobz');
    expect(globalLog.length).toEqual(0);
  });

  it('should not log exposure if "get" is called on a param not in the experiment (compat)', function() {
    class TestVanillaExperiment extends BaseExperimentCompat {
      assign(params, args) {
        params.set('foo', new UniformChoiceCompat({'choices': ['a', 'b'], 'unit': args.i}));
      }
    }
    globalLog = [];
    var e = new TestVanillaExperiment({ 'i': 42});
    e.get('fobz');
    expect(globalLog.length).toEqual(0);
  });
});
