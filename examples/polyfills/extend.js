/* This is basically a way to easily extend classes in ES5 - source: https://gist.github.com/juandopazo/1367191 */
Object.getOwnPropertyDescriptors = function getOwnPropertyDescriptors(obj) {
  var descriptors = {};
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      descriptors[prop] = Object.getOwnPropertyDescriptor(obj, prop);
    }
  }
  return descriptors;
};

Function.prototype.extend = function extend(proto) {
    var superclass = this;
    var constructor;

    if (!proto.hasOwnProperty('constructor')) {
      Object.defineProperty(proto, 'constructor', {
        value: function () {
            // Default call to superclass as in maxmin classes
            superclass.apply(this, arguments);
        },
        writable: true,
        configurable: true,
        enumerable: false
      });
    }
    constructor = proto.constructor;

    constructor.prototype = Object.create(this.prototype, Object.getOwnPropertyDescriptors(proto));

    return constructor;
};
/* End extend helper */
