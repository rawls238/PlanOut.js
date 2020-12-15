const planoutJs = jest.requireActual('../dist/planout.js');
const planoutCoreCompatibleJs = jest.requireActual('../dist/planout_core_compatible.js');

describe('Test exported ../dist/planout.js interface', function() {
  it('Should export Assignment function', function() {
    expect(typeof planoutJs.Assignment).toEqual('function');
  });

  it('Should export Experiment function', function() {
    expect(typeof planoutJs.Experiment).toEqual('function');
  });

  it('Should export ExperimentSetup function', function() {
    expect(typeof planoutJs.ExperimentSetup).toEqual('object');
  });

  it('Should export Interpreter function', function() {
    expect(typeof planoutJs.Interpreter).toEqual('function');
  });

  it('Should export Ops object', function() {
    expect(typeof planoutJs.Ops).toEqual('object');
  });

  it('Should export Namespace function', function() {
    expect(typeof planoutJs.Namespace).toEqual('object');
  });
});

describe('Test exported ../dist/planout_core_compatible.js interface', function() {
  it('Should export Assignment function', function() {
    expect(typeof planoutCoreCompatibleJs.Assignment).toEqual('function');
  });

  it('Should export Experiment function', function() {
    expect(typeof planoutCoreCompatibleJs.Experiment).toEqual('function');
  });

  it('Should export ExperimentSetup function', function() {
    expect(typeof planoutCoreCompatibleJs.ExperimentSetup).toEqual('object');
  });

  it('Should export Interpreter function', function() {
    expect(typeof planoutCoreCompatibleJs.Interpreter).toEqual('function');
  });

  it('Should export Ops object', function() {
    expect(typeof planoutCoreCompatibleJs.Ops).toEqual('object');
  });

  it('Should export Namespace function', function() {
    expect(typeof planoutCoreCompatibleJs.Namespace).toEqual('object');
  });
});
