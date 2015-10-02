# PlanOut.js

PlanOut.js is a JavaScript-based implementation of [PlanOut](http://facebook.github.io/planout/).
It provides a complete implementation of the PlanOut native API framework and
a PlanOut language interpreter.

PlanOut.js is implemented in ES6, and can also be used with ES5.

##Installation

PlanOut.js is available on [npm](https://www.npmjs.com/package/planout) and can
be installed by running:

```
npm install planout
```

It is also available on bower and can be installed by running:
```
bower install planout
```

## Comparison with Reference Implementation

PlanOut.js provides an implementation of all PlanOut features (including the
experiment class, interpreter, and namespaces).

##Usage

This is how you would use PlanOut.js in ES6 to create an experiment:

```javascript
import PlanOut from 'PlanOut';

class MyExperiment extends PlanOut.Experiment {
	
  configureLogger() {
    return;
    //configure logger
  }

  log(event) {
    //log the event somewhere
  }

  previouslyLogged() {
    //check if we’ve already logged an event for this user
  }

  setup() {
    //set experiment name, etc.
  }

  /*
  This function should return a list of the possible parameter names that the assignment procedure may assign.
  You can optionally override this function to always return this.getDefaultParamNames() which will analyze your program at runtime to determine what the range of possible experimental parameters are. Otherwise, simply return a fixed list of the experimental parameters that your assignment procedure may assign.
  */
  
  getParamNames() {
    return this.getDefaultParamNames();
  }
	
  assign(params, args) {
    params.set('foo', new PlanOut.Ops.Random.UniformChoice({choices: ['a', 'b'], ‘unit’: args.userId}));
  }

}
```

Then, to use this experiment you would simply need to do:

```javascript
var exp = new MyExperiment({userId: user.id });
console.log("User has foo param set to " + exp.get('foo'));
```

If you wanted to run the experiment in a namespace you would do:

```javascript

class MyNameSpace extends PlanOut.Namespace.SimpleNamespace {
	
  setupDefaults() {
    this.numSegments = 100;
  }

  setup() {
    this.setName('MyNamespace');
    this.setPrimaryUnit('userId');
  }

  setupExperiments() {
    this.addExperiment('MyExperiment', MyExperiment, 50);
  }
}
```

Then, to use the namespace you would do:
```javascript
var namespace = new MyNamespace({userId: user.id });
console.log("User has foo param set to " + namespace.get('foo'));
```

An example of using PlanOut.js with ES5 can be [found here]
(https://github.com/facebook/planout/blob/master/alpha/js/examples/sample_planout_es5.js)

An example with the PlanOut interpreter can be [found here](https://github.com/HubSpot/PlanOut.js/blob/master/__tests__/testInterpreter.js)


If you're running UI experiments and are using React then you should use [react-experiments](https://github.com/HubSpot/react-experiments) which plays very nicely with PlanOut.js namespaces and experiments.

## Experimental Overrides

There are two ways to override experimental parameters. There are global overrides and local overrides. Global overrides let you define who should receive these overrides and what those values should be set. It is not recommended to be used for anything apart from feature rollouts.

To use global overrides simply do something similar the following in your namespace class:

```javascript
allowedOverride() {
  //(you may need to pass additional information to the namespace this to work)
  //some criteria for determining who should receive overrides
  return this.inputs.email.endsWith('hubspot.com');
}

getOverrides() {
  return {
    '[param name]': {
      'experimentName': [experiment Name],
      'value': [value of override]
    },
    'show_text': {
      'experimentName': 'Experiment1',
      'value': 'test'
    }
  };
}
```

Local overrides are basically client-side overrides you can set via query parameters or via localStorage.

For example, suppose you want to override the show_text variable to be 'test' locally. You would simply do 
```
http://[some_url]?experimentOverride=Experiment1&show_text=test
```

or you could set experimentOverride=Experiment1 and show_text=test in localStorage

Note that in both cases exposure will be logged as though users had been randomly assigned these values.

The primary use of global overrides should be for feature rollouts and the primary use of local overrides should be for local testing


## Client-side Usage

While PlanOut.js can be used in either client-side applications or node.js applications, PlanOut.js comes packaged with an ```ExperimentSetup``` utility to make it easier to integrate PlanOut.js into a standard client-side single page app architecture. It currently only works with namespace classes.

By calling ```ExperimentSetup.registerExperimentInput('key', 'value', [optional namespace name])```, you can register a particular value as an input to either all namespaces (by not passing the third argument, it assumes that this should be registered as an input across all experiments) or to a particular namespace (by passing the namespace name as the third argument).

This allows you to keep your namespace class definition and initialization separate from your core application bootstrapping and simply makes it necessary to call ExperimentSetup when you have fetched the necessary inputs.

For instance, one could have a namespace defined in a file called 'mynamespace.js'

```javascript
var namespace = new MyNamespace({ 'foo': 'bar'});
```

and register a user identifier input to it when the application bootstraps and fetches user information.

```javascript
getUserInfo().then((response) => {
  ExperimentSetup.registerExperimentInput('userid', response.userId);
});
```

This is also useful when an experiment is intended to interface with external services and allows certain experiment-specific inputs to be restricted to the namespaces that they are intended for.

With this it is important to watch out for race conditions since you should ensure that before your application ever fetches any experiment parameters it registers the necessary inputs.

## Use with React.js

If you are using React.js for your views, [react-experiments](https://github.com/HubSpot/react-experiments) should make it very easy to run UI experiments

## Development

This project uses [Jest](https://facebook.github.io/jest/) for testing. The tests can be found in the __tests__ folder and running the tests simply requires running the command: npm test

If you are making changes to the ES6 implementation, simply run grunt and it will transpile to the corresponding ES5 code.
