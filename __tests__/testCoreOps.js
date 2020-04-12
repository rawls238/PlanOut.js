var Interpreter = require.requireActual('../dist/planout.js').Interpreter;
var InterpreterCompat = require.requireActual('../dist/planout_core_compatible.js').Interpreter;

function runConfig(config, init={}) {
  var interpreter = new Interpreter(config, 'test_salt', init);
  return interpreter.getParams();
}

function runConfigSingle(config) {
  var xConfig = {'op': 'set', 'var': 'x', 'value': config};
  return runConfig(xConfig)['x'];
}

function runConfigCompat(config, init={}) {
  var interpreter = new InterpreterCompat(config, 'test_salt', init);
  return interpreter.getParams();
}

function runConfigSingleCompat(config) {
  var xConfig = {'op': 'set', 'var': 'x', 'value': config};
  return runConfigCompat(xConfig)['x'];
}

describe ("Test core operators", function() {
  it('should set appropriately', function() {
    var c = {'op': 'set', 'value': 'x_val', 'var': 'x'}
    var d = runConfig(c);
    var dCompat = runConfigCompat(c);
    expect(d).toEqual({ 'x': 'x_val'});
    expect(dCompat).toEqual({ 'x': 'x_val'});
  });

  it('should work with seq', function() {
    var config = {'op': 'seq', 'seq': [
      {'op': 'set', 'value': 'x_val', 'var': 'x'},
      {'op': 'set', 'value': 'y_val', 'var': 'y'}
    ]};
    var result = {'x': 'x_val', 'y': 'y_val'};

    var d = runConfig(config);
    var dCompat = runConfigCompat(config);

    expect(d).toEqual(result);
    expect(dCompat).toEqual(result);
  });

  it('should work with arr', function() {
    var arr = [4, 5, 'a'];
    var config = {'op': 'array', 'values': arr};
    var a = runConfigSingle(config);
    var aCompat = runConfigSingleCompat(config);
    expect(arr).toEqual(a);
    expect(arr).toEqual(aCompat);
  });

  it('should work with get', function() {
    var config = {
      'op': 'seq',
      'seq': [
          {'op': 'set', 'var': 'x', 'value': 'x_val'},
          {'op': 'set', 'var': 'y', 'value': {'op': 'get', 'var': 'x'}}
      ]
    };
    var d = runConfig(config);
    var dCompat = runConfigCompat(config);
    expect({'x': 'x_val', 'y': 'x_val'}).toEqual(d);
    expect({'x': 'x_val', 'y': 'x_val'}).toEqual(dCompat);
  });

  it('should work with cond', function() {
    var getInput = function(i, r) {
      return {'op': 'equals', 'left': i, 'right': r};
    };
    var testIf = function(i) {
      return runConfig({
        'op': 'cond',
          'cond': [
              {'if': getInput(i, 0),
               'then': {'op': 'set', 'var': 'x', 'value': 'x_0'}},
              {'if': getInput(i, 1),
               'then': {'op': 'set', 'var': 'x', 'value': 'x_1'}}
          ]
      });
    };
    var testIfCompat = function(i) {
      return runConfigCompat({
        'op': 'cond',
          'cond': [
              {'if': getInput(i, 0),
               'then': {'op': 'set', 'var': 'x', 'value': 'x_0'}},
              {'if': getInput(i, 1),
               'then': {'op': 'set', 'var': 'x', 'value': 'x_1'}}
          ]
      });
    };

    var result1 = { 'x': 'x_0'};
    var result2 = { 'x': 'x_1'};

    expect(testIf(0)).toEqual(result1);
    expect(testIf(1)).toEqual(result2);
    expect(testIfCompat(0)).toEqual(result1);
    expect(testIfCompat(1)).toEqual(result2);
  });

  it('should work with index', function() {
    var arrayLiteral = [10, 20, 30];
    var objLiteral = {'a': 42, 'b': 43};

      var x = runConfigSingle(
          {'op': 'index', 'index': 0, 'base': arrayLiteral}
      )
      expect(x).toEqual(10);
      
      x = runConfigSingle(
          {'op': 'index', 'index': 2, 'base': arrayLiteral}
      )
      expect(x).toEqual(30);

      x = runConfigSingle(
          {'op': 'index', 'index': 'a', 'base': objLiteral}
      )
      expect(x).toEqual(42);

      x = runConfigSingle(
          {'op': 'index', 'index': 6, 'base': arrayLiteral}
      )
      expect(x).toBe(undefined);

      x = runConfigSingle(
          {'op': 'index', 'index': 'c', 'base': objLiteral}
      )
      expect(x).toBe(undefined);

      x = runConfigSingle({
          'op': 'index',
          'index': 2,
          'base': {'op': 'array', 'values': arrayLiteral}
      });
      expect(x).toEqual(30);
  });

  it('should work with index (compat)', function() {
    var arrayLiteral = [10, 20, 30];
    var objLiteral = {'a': 42, 'b': 43};

      var x = runConfigSingleCompat(
          {'op': 'index', 'index': 0, 'base': arrayLiteral}
      )
      expect(x).toEqual(10);
      
      x = runConfigSingleCompat(
          {'op': 'index', 'index': 2, 'base': arrayLiteral}
      )
      expect(x).toEqual(30);

      x = runConfigSingleCompat(
          {'op': 'index', 'index': 'a', 'base': objLiteral}
      )
      expect(x).toEqual(42);

      x = runConfigSingleCompat(
          {'op': 'index', 'index': 6, 'base': arrayLiteral}
      )
      expect(x).toBe(undefined);

      x = runConfigSingleCompat(
          {'op': 'index', 'index': 'c', 'base': objLiteral}
      )
      expect(x).toBe(undefined);

      x = runConfigSingleCompat({
          'op': 'index',
          'index': 2,
          'base': {'op': 'array', 'values': arrayLiteral}
      });
      expect(x).toEqual(30);
  });

  it('should work with coalesce', function() {
    var x = runConfigSingle({'op': 'coalesce', 'values': [null]});
    expect(x).toEqual(null);

    x = runConfigSingle({'op': 'coalesce', 'values': [null, 42, null]});
    expect(x).toEqual(42);

    x = runConfigSingle({'op': 'coalesce', 'values': [null, null, 43]});
    expect(x).toEqual(43);
  });

  it('should work with coalesce (compat)', function() {
    var x = runConfigSingleCompat({'op': 'coalesce', 'values': [null]});
    expect(x).toEqual(null);

    x = runConfigSingleCompat({'op': 'coalesce', 'values': [null, 42, null]});
    expect(x).toEqual(42);

    x = runConfigSingleCompat({'op': 'coalesce', 'values': [null, null, 43]});
    expect(x).toEqual(43);
  });

  it('should work with length', function() {
    var arr = [0, 1, 2, 3, 4, 5];
    var length_test = runConfigSingle({'op': 'length', 'value': arr});
    expect(length_test).toEqual(arr.length);
    length_test = runConfigSingle({'op': 'length', 'value': []});
    expect(length_test).toEqual(0);
    length_test = runConfigSingle(
      {'op': 'length', 'value': {'op': 'array', 'values': arr}});
    expect(length_test).toEqual(arr.length);
  });

  it('should work with length (compat)', function() {
    var arr = [0, 1, 2, 3, 4, 5];
    var length_test = runConfigSingleCompat({'op': 'length', 'value': arr});
    expect(length_test).toEqual(arr.length);
    length_test = runConfigSingleCompat({'op': 'length', 'value': []});
    expect(length_test).toEqual(0);
    length_test = runConfigSingleCompat(
      {'op': 'length', 'value': {'op': 'array', 'values': arr}});
    expect(length_test).toEqual(arr.length);
  });

  it('should work with not', function() {
    var x = runConfigSingle({'op': 'not', 'value': 0})
    expect(x).toBe(true);

    x = runConfigSingle({'op': 'not', 'value': false});
    expect(x).toBe(true);

    x = runConfigSingle({'op': 'not', 'value': 1})
    expect(x).toBe(false);

    x = runConfigSingle({'op': 'not', 'value': true});
    expect(x).toBe(false);
  });

  it('should work with not (compat)', function() {
    var x = runConfigSingleCompat({'op': 'not', 'value': 0})
    expect(x).toBe(true);

    x = runConfigSingleCompat({'op': 'not', 'value': false});
    expect(x).toBe(true);

    x = runConfigSingleCompat({'op': 'not', 'value': 1})
    expect(x).toBe(false);

    x = runConfigSingleCompat({'op': 'not', 'value': true});
    expect(x).toBe(false);
  });

  it('should work with round', function() {
    var x = runConfigSingle({'op': 'round', 'value': 3.4});
    expect(x).toBe(3);
  });

  it('should work with round (compat)', function() {
    var x = runConfigSingleCompat({'op': 'round', 'value': 3.4});
    expect(x).toBe(3);
  });

  it('should work with exp 1', function() {
    var x = runConfigSingle({'op': 'exp', 'value': 1});
    expect(x).toBe(2.718281828459045);
  });

  it('should work with exp 1 (compat)', function() {
    var x = runConfigSingleCompat({'op': 'exp', 'value': 1});
    expect(x).toBe(2.718281828459045);
  });

  it('should work with exp negative', function() {
    var x = runConfigSingle({'op': 'exp', 'value': -0.5});
    expect(x).toBe(0.6065306597126334);
  });

  it('should work with exp negative (compat)', function() {
    var x = runConfigSingleCompat({'op': 'exp', 'value': -0.5});
    expect(x).toBe(0.6065306597126334);
  });

  it('should work with exp non negative larger than 0 decimal', function() {
    var x = runConfigSingle({'op': 'exp', 'value': 0.123});
    expect(x).toBe(1.1308844209474893);
  });

  it('should work with exp non negative larger than 0 decimal (compat)', function() {
    var x = runConfigSingleCompat({'op': 'exp', 'value': 0.123});
    expect(x).toBe(1.1308844209474893);
  });

  it('should work with exp non negative larger than 1 decimal', function() {
    var x = runConfigSingle({'op': 'exp', 'value': 1.88});
    expect(x).toBe(6.553504862191148);
  });

  it('should work with exp non negative larger than 1 decimal (compat)', function() {
    var x = runConfigSingleCompat({'op': 'exp', 'value': 1.88});
    expect(x).toBe(6.553504862191148);
  });

  it('should work with sqrt 1', function() {
    var x = runConfigSingle({'op': 'sqrt', 'value': 1});
    expect(x).toBe(1);
  });

  it('should work with sqrt 1 (compat)', function() {
    var x = runConfigSingleCompat({'op': 'sqrt', 'value': 1});
    expect(x).toBe(1);
  });

  it('should work with sqrt non negative larger than 0', function() {
    var x = runConfigSingle({'op': 'sqrt', 'value': 0.123});
    expect(x).toBe(0.3507135583350036);
  });

  it('should work with sqrt non negative larger than 0 (compat)', function() {
    var x = runConfigSingleCompat({'op': 'sqrt', 'value': 0.123});
    expect(x).toBe(0.3507135583350036);
  });

  it('should work with sqrt non negative larger than 1', function() {
    var x = runConfigSingle({'op': 'sqrt', 'value': 1.88});
    expect(x).toBe(1.3711309200802089);
  });

  it('should work with sqrt non negative larger than 1 (compat)', function() {
    var x = runConfigSingleCompat({'op': 'sqrt', 'value': 1.88});
    expect(x).toBe(1.3711309200802089);
  });

  it('should work with or', function() {
    var x = runConfigSingle({
            'op': 'or',
            'values': [0, 0, 0]})
    expect(x).toBe(false);

    x = runConfigSingle({
        'op': 'or',
        'values': [0, 0, 1]})
    expect(x).toBe(true);

    x = runConfigSingle({
        'op': 'or',
        'values': [false, true, false]})
    expect(x).toBe(true);
  });

  it('should work with or (compat)', function() {
    var x = runConfigSingleCompat({
            'op': 'or',
            'values': [0, 0, 0]})
    expect(x).toBe(false);

    x = runConfigSingleCompat({
        'op': 'or',
        'values': [0, 0, 1]})
    expect(x).toBe(true);

    x = runConfigSingleCompat({
        'op': 'or',
        'values': [false, true, false]})
    expect(x).toBe(true);
  });

  it('should work with and', function() {
    var x = runConfigSingle({
            'op': 'and',
            'values': [1, 1, 0]})
    expect(x).toEqual(false);

    x = runConfigSingle({
        'op': 'and',
        'values': [0, 0, 1]})
   expect(x).toBe(false);

    x = runConfigSingle({
        'op': 'and',
        'values': [true, true, true]})
    expect(x).toBe(true);
  });

  it('should work with and (compat)', function() {
    var x = runConfigSingleCompat({
            'op': 'and',
            'values': [1, 1, 0]})
    expect(x).toEqual(false);

    x = runConfigSingleCompat({
        'op': 'and',
        'values': [0, 0, 1]})
   expect(x).toBe(false);

    x = runConfigSingleCompat({
        'op': 'and',
        'values': [true, true, true]})
    expect(x).toBe(true);
  });

  it('should work with commutative operators', function() {
    var arr = [33, 7, 18, 21, -3];

    var minTest = runConfigSingle({'op': 'min', 'values': arr});
    expect(minTest).toEqual(-3);

    var maxTest = runConfigSingle({'op': 'max', 'values': arr});
    expect(maxTest).toEqual(33);

    var sumTest = runConfigSingle({'op': 'sum', 'values': arr});
    expect(sumTest).toEqual(76);

    var productTest = runConfigSingle({'op': 'product', 'values': arr});
    expect(productTest).toEqual(-261954);
  });

  it('should work with commutative operators (compat)', function() {
    var arr = [33, 7, 18, 21, -3];

    var minTest = runConfigSingleCompat({'op': 'min', 'values': arr});
    expect(minTest).toEqual(-3);

    var maxTest = runConfigSingleCompat({'op': 'max', 'values': arr});
    expect(maxTest).toEqual(33);

    var sumTest = runConfigSingleCompat({'op': 'sum', 'values': arr});
    expect(sumTest).toEqual(76);

    var productTest = runConfigSingleCompat({'op': 'product', 'values': arr});
    expect(productTest).toEqual(-261954);
  });

  it('should work with binary operators', function() {
    var eq = runConfigSingle({'op': 'equals', 'left': 1, 'right': 2});
    expect(eq).toEqual(1 == 2);

    eq = runConfigSingle({'op': 'equals', 'left': 2, 'right': 2});
    expect(eq).toEqual(2 == 2);

    var gt = runConfigSingle({'op': '>', 'left': 1, 'right': 2});
    expect(gt).toEqual(1 > 2);
    
    var lt = runConfigSingle({'op': '<', 'left': 1, 'right': 2});
    expect(lt).toEqual(1 < 2);
    
    var gte = runConfigSingle({'op': '>=', 'left': 2, 'right': 2});
    expect(gte).toEqual(2 >= 2);
    gte = runConfigSingle({'op': '>=', 'left': 1, 'right': 2});
    expect(gte).toEqual(1 >= 2);

    var lte = runConfigSingle({'op': '<=', 'left': 2, 'right': 2});
    expect(lte).toEqual(2 <= 2);

    var mod = runConfigSingle({'op': '%', 'left': 11, 'right': 3});
    expect(mod).toEqual(11 % 3);

    var div = runConfigSingle({'op': '/', 'left': 3, 'right': 4})
    expect(div).toEqual(0.75);
  });

  it('should work with binary operators (compat)', function() {
    var eq = runConfigSingleCompat({'op': 'equals', 'left': 1, 'right': 2});
    expect(eq).toEqual(1 == 2);

    eq = runConfigSingleCompat({'op': 'equals', 'left': 2, 'right': 2});
    expect(eq).toEqual(2 == 2);

    var gt = runConfigSingleCompat({'op': '>', 'left': 1, 'right': 2});
    expect(gt).toEqual(1 > 2);
    
    var lt = runConfigSingleCompat({'op': '<', 'left': 1, 'right': 2});
    expect(lt).toEqual(1 < 2);
    
    var gte = runConfigSingleCompat({'op': '>=', 'left': 2, 'right': 2});
    expect(gte).toEqual(2 >= 2);
    gte = runConfigSingleCompat({'op': '>=', 'left': 1, 'right': 2});
    expect(gte).toEqual(1 >= 2);

    var lte = runConfigSingleCompat({'op': '<=', 'left': 2, 'right': 2});
    expect(lte).toEqual(2 <= 2);

    var mod = runConfigSingleCompat({'op': '%', 'left': 11, 'right': 3});
    expect(mod).toEqual(11 % 3);

    var div = runConfigSingleCompat({'op': '/', 'left': 3, 'right': 4})
    expect(div).toEqual(0.75);
  });

  it('should work with map', function() {
    let mapVal = {'a': 2, 'b': 'c', 'd': false };
    let mapOp = runConfigSingle({'op': 'map', 'a': 2, 'b': 'c', 'd': false});
    expect(mapOp).toEqual(mapVal);

    let emptyMap = {};
    let mapOp2 = runConfigSingle({'op': 'map'});
    expect(emptyMap).toEqual(mapOp2);
  });

  it('should work with map (compat)', function() {
    let mapVal = {'a': 2, 'b': 'c', 'd': false };
    let mapOp = runConfigSingleCompat({'op': 'map', 'a': 2, 'b': 'c', 'd': false});
    expect(mapOp).toEqual(mapVal);

    let emptyMap = {};
    let mapOp2 = runConfigSingleCompat({'op': 'map'});
    expect(emptyMap).toEqual(mapOp2);
  });

  it('should work with return', function() {
    var returnRunner = function(return_value) {
      var config = {
          "op": "seq",
          "seq": [
              {
                "op": "set",
                "var": "x",
                "value": 2
              },
              {
                  "op": "return",
                  "value": return_value
              },
              {
                  "op": "set",
                  "var": "y",
                  "value": 4
              }
          ]
      };
      var e = new Interpreter(config, 'test_salt');
      return e;
    };

    var returnRunnerCompat = function(return_value) {
      var config = {
          "op": "seq",
          "seq": [
              {
                "op": "set",
                "var": "x",
                "value": 2
              },
              {
                  "op": "return",
                  "value": return_value
              },
              {
                  "op": "set",
                  "var": "y",
                  "value": 4
              }
          ]
      };
      var e = new InterpreterCompat(config, 'test_salt');
      return e;
    };

    var i = returnRunner(true);
    expect(i.getParams()).toEqual({'x': 2});
    expect(i.inExperiment()).toEqual(true);

    i = returnRunnerCompat(true);
    expect(i.getParams()).toEqual({'x': 2});
    expect(i.inExperiment()).toEqual(true);

    i = returnRunner(42);
    expect(i.getParams()).toEqual({ 'x': 2});
    expect(i.inExperiment()).toEqual(true);

    i = returnRunnerCompat(42);
    expect(i.getParams()).toEqual({ 'x': 2});
    expect(i.inExperiment()).toEqual(true);

    i = returnRunner(false);
    expect(i.getParams()).toEqual({ 'x': 2});
    expect(i.inExperiment()).toEqual(false);

    i = returnRunnerCompat(false);
    expect(i.getParams()).toEqual({ 'x': 2});
    expect(i.inExperiment()).toEqual(false);

    i = returnRunner(0);
    expect(i.getParams()).toEqual({ 'x': 2});
    expect(i.inExperiment()).toEqual(false);

    i = returnRunnerCompat(0);
    expect(i.getParams()).toEqual({ 'x': 2});
    expect(i.inExperiment()).toEqual(false);
  });
});
