import { shallowCopy, forEach, hasKey } from "./lib/utils";

export default function provideAssignement(Random) {
  class Assignment {
    constructor(experimentSalt, overrides) {
      if (!overrides) {
        overrides = {};
      }
      this.experimentSalt = experimentSalt;
      this._overrides = shallowCopy(overrides);
      this._data = shallowCopy(overrides);
      this.saltSeparator = '.';
    }

    evaluate(value) {
      return value;
    }

    getOverrides() {
      return this._overrides;
    }

    addOverride(key, value) {
      this._overrides[key] = value;
      this._data[key] = value;
    }

    setOverrides(overrides) {
      this._overrides = shallowCopy(overrides);
      var self = this;
      forEach(Object.keys(this._overrides), function(overrideKey) {
        self._data[overrideKey] = self._overrides[overrideKey];
      });
    }

    set(name, value) {
      if (name === '_data') {
        this._data = value;
        return;
      } else if (name === '_overrides') {
        this._overrides = value;
        return;
      } else if (name === 'experimentSalt') {
        this.experimentSalt = value;
        return;
      } else if (name === 'saltSeparator') {
        this.saltSeparator = value;
        return;
      }

      if (hasKey(this._overrides, name)) {
        return;
      }
      if (value instanceof Random.PlanOutOpRandom) {
        if (!value.args.salt) {
          value.args.salt = name;
        }
        this._data[name] = value.execute(this);
      } else {
        this._data[name] = value;
      }
    }

    get(name, defaultVal) {
      if (name === '_data') {
        return this._data;
      } else if(name === '_overrides') {
        return this._overrides;
      } else if (name === 'experimentSalt') {
        return this.experimentSalt;
      } else if (name === 'saltSeparator') {
        return this.saltSeparator;
      } else {
        var value = this._data[name];
        return value === null || value === undefined ? defaultVal : value;
      }
    }

    getParams() {
      return this._data;
    }

    del(name) {
      delete this._data[name];
    }

    toString() {
      return String(this._data);
    }

    length() {
      return Object.keys(this._data).length;
    }
  };

  return Assignment;
}
