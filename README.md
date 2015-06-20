# PlanOut.js #
=============
PlanOut.js is a JavaScript-based implementation of [PlanOut](http://facebook.github.io/planout/).
It provides a complete implementation of the PlanOut native API framework and
a PlanOut language interpreter.

PlanOut.js is implemented in ES6, and can also be used with ES5.

##Installation##
-----------
PlanOut.js is available on [npm](https://www.npmjs.com/package/planout) and can
be installed by running:

```
npm install planout
```

##Comparison with Reference Implementation##
-----

PlanOut.js provides an implementation of all PlanOut features (including the
experiment class, interpreter, and namespaces).

##Usage##
-----

This is how you would use PlanOut.js in ES6 to create an experiment:

```javascript
import PlanOut from 'planout';

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
	
	assign(params, args) {
		params.set('foo', new PlanOut.Ops.Random.UniformChoice({choices: ['a', 'b'], ‘unit’: args.id}));
	}

}
```

Then, to use this experiment you would simply need to do:

```javascript
var exp = new MyExperiment({id: user.id });
console.log("User has foo param set to " + exp.get('foo'));
```

If you wanted to run the experiment in a namespace you would do the following

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

An example of using PlanOut.js with ES5 can be [found here]
(https://github.com/facebook/planout/blob/master/alpha/js/examples/sample_planout_es5.js),
An example with the PlanOut interpreter can be [found here](https://github.com/HubSpot/PlanOut.js/blob/master/__tests__/testInterpreter.js)


## Development ##
----- 

This project uses [Jest](https://facebook.github.io/jest/) for testing. The tests can be found in the __tests__ folder and running the tests simply requires running the command: npm test

## Transpile to ES5 ##
-----

If you are making changes to the ES6 implementation, simply run grunt and it will transpile to the corresponding ES5 code.
