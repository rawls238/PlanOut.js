var UniformChoice = require.requireActual('../dist/planout.js').Ops.Random.UniformChoice;
var Experiment = require.requireActual('../dist/planout.js').Experiment;
var Namespace = require.requireActual('../dist/planout.js').Namespace;
var ExperimentSetup = require.requireActual('../dist/planout.js').ExperimentSetup;
var UniformChoiceCompat = require.requireActual('../dist/planout_core_compatible.js').Ops.Random.UniformChoice;
var ExperimentCompat = require.requireActual('../dist/planout_core_compatible.js').Experiment;
var NamespaceCompat = require.requireActual('../dist/planout_core_compatible.js').Namespace;
var ExperimentSetupCompat = require.requireActual('../dist/planout_core_compatible.js').ExperimentSetup;


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

class Experiment1 extends BaseExperiment {
  assign(params, args) {
    params.set('foo', new UniformChoice({'choices': ['a', 'b'], 'unit': args.userid}));
    params.set('paramVal', args.paramVal);
    params.set('funcVal', args.funcVal);
  }
}

class Experiment2 extends BaseExperiment {
  assign(params, args) {
    params.set('foobar', new UniformChoice({'choices': ['a', 'b'], 'unit': args.userid}));
    params.set('paramVal', args.paramVal);
    params.set('funcVal', args.funcVal);
  }
}

class Experiment1Compat extends BaseExperimentCompat {
  assign(params, args) {
    params.set('foo', new UniformChoiceCompat({'choices': ['a', 'b'], 'unit': args.userid}));
    params.set('paramVal', args.paramVal);
    params.set('funcVal', args.funcVal);
  }
}

class Experiment2Compat extends BaseExperimentCompat {
  assign(params, args) {
    params.set('foobar', new UniformChoiceCompat({'choices': ['a', 'b'], 'unit': args.userid}));
    params.set('paramVal', args.paramVal);
    params.set('funcVal', args.funcVal);
  }
}

class BaseTestNamespace extends Namespace.SimpleNamespace {
  setup() {
    this.setName('testThis');
    this.setPrimaryUnit('userid');
  }

  setupDefaults() {
    this.numSegments = 100;
  }

  setupExperiments() {
    this.addExperiment('Experiment1', Experiment1, 50);
    this.addExperiment('Experiment2', Experiment2, 50);
  }
};

class BaseTestNamespaceCompat extends NamespaceCompat.SimpleNamespace {
  setup() {
    this.setName('testThis');
    this.setPrimaryUnit('userid');
  }

  setupDefaults() {
    this.numSegments = 100;
  }

  setupExperiments() {
    this.addExperiment('Experiment1', Experiment1Compat, 50);
    this.addExperiment('Experiment2', Experiment2Compat, 50);
  }
};

describe("Test the experiment setup module", function() {
  it('works with global experiment inputs', function() {
    var namespace = new BaseTestNamespace({'userid': 'a'});
    var fooVal = namespace.get('foo');
    var foobarVal = namespace.get('foobar');
    var namespace2 = new BaseTestNamespace();
    ExperimentSetup.registerExperimentInput('userid', 'a');
    expect(fooVal).toEqual(namespace2.get('foo'));
    expect(foobarVal).toEqual(namespace2.get('foobar'));
  });

  it('works with global experiment inputs (compat)', function() {
    var namespace = new BaseTestNamespaceCompat({'userid': 'a'});
    var fooVal = namespace.get('foo');
    var foobarVal = namespace.get('foobar');
    var namespace2 = new BaseTestNamespaceCompat();
    ExperimentSetupCompat.registerExperimentInput('userid', 'a');
    expect(fooVal).toEqual(namespace2.get('foo'));
    expect(foobarVal).toEqual(namespace2.get('foobar'));
  });

  it('works with namespace scoped inputs', function() {
    var namespace = new BaseTestNamespace({'userid': 'a'});
    ExperimentSetup.registerExperimentInput('paramVal', '3', namespace.getName());
    expect(namespace.get('paramVal')).toEqual('3');

    class TestNamespace extends BaseTestNamespace {
      setup() {
        this.setName('test2');
        this.setPrimaryUnit('userid');
      }
    }

    var namespace2 = new TestNamespace();
    expect(namespace2.get('foo')).toBeUndefined();
    expect(namespace2.get('paramVal')).toBeUndefined();
  });

  it('works with namespace scoped inputs (compat)', function() {
    var namespace = new BaseTestNamespaceCompat({'userid': 'a'});
    ExperimentSetupCompat.registerExperimentInput('paramVal', '3', namespace.getName());
    expect(namespace.get('paramVal')).toEqual('3');

    class TestNamespace extends BaseTestNamespaceCompat {
      setup() {
        this.setName('test2');
        this.setPrimaryUnit('userid');
      }
    }

    var namespace2 = new TestNamespace();
    expect(namespace2.get('foo')).toEqual('b');
    expect(namespace2.get('paramVal')).toBeUndefined();
  });

  it('works with function inputs', function() {
    var namespace = new BaseTestNamespace({'userid': 'a'});
    var funct = function() {
      return '3';
    };
    ExperimentSetup.registerExperimentInput('funcVal', funct);
    expect(namespace.get('funcVal')).toEqual('3');
  });

  it('works with function inputs (compat)', function() {
    var namespace = new BaseTestNamespaceCompat({'userid': 'a'});
    var funct = function() {
      return '3';
    };
    ExperimentSetupCompat.registerExperimentInput('funcVal', funct);
    expect(namespace.get('funcVal')).toEqual('3');
  });
});
