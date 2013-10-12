;(function(exports) {
  exports.andro = {
    // Shuts down and removes ALL behaviours from passed owner object
    tearDown: function(owner) {
      if(isSetup(owner)) {
        this.eventer(owner).unbindAll();
        delete owner.andro; // remove andro from owner object
      }
    },

    // Adds the passed behaviour to the passed owner
    augment: function(owner, behaviourMixin, settings) {
      if(behaviourMixin === undefined) {
        throw "You must pass a behaviour with which to augment the owner.";
      }

      setupIfNotSetup(owner);

      var behaviour = {};
      owner.andro.behaviours.push(behaviour);
      extend(behaviour, behaviourMixin);

      // write exports to owner
      if(behaviour.setup !== undefined) {
        settings = settings || {};
        var exports = behaviour.setup(owner, owner.andro.eventer, settings);
        for(var name in exports) {
          if(owner[name] === undefined) {
            owner[name] = makeFn(exports[name], behaviour);
          }
          else {
            throw "Behaviour export would overwrite existing attribute on owner.";
          }
        }
      }
    },

    // Returns eventer obj for passed owner object
    eventer: function(owner) {
      setupIfNotSetup(owner);
      return owner.andro.eventer;
    }
  };

    // Sets up the passed owner object to use behaviours
  var setupIfNotSetup = function(owner) {
    if (!isSetup(owner)) {
      owner.andro = {};
      owner.andro.behaviours = [];
      owner.andro.eventer = new Eventer();
    }
  };

  // Returns true if owner has andro obj on it.
  var isSetup = function(owner) {
    return owner.andro !== undefined;
  };

  var extend = function(target, extensions) {
    for(var property in extensions) {
      if(extensions[property] && extensions[property].constructor &&
         extensions[property].constructor === Object) {
        target[property] = extend(target[property] || {}, extensions[property]);
      }
      else {
        target[property] = extensions[property];
      }
    }

    return target;
  };

  var makeFn = function(fn, behaviour) {
    return function() {
      return fn.apply(behaviour, arguments);
    };
  };

  function Eventer() {
    this.callbacks = {};
  }

  Eventer.prototype = {
    bind: function(obj, event, callback) {
      this.callbacks[event] = this.callbacks[event] || [];
      this.callbacks[event].push({
        obj: obj,
        callback: callback
      });

      return this;
    },

    unbind: function(obj, event) {
      for(var boundEvent in this.callbacks) {
        for(var i = 0; i < this.callbacks[boundEvent].length; i++) {
          if(this.callbacks[boundEvent][i].obj === obj) {
            this.callbacks[boundEvent].splice(i, 1);
            break;
          }
        }
      }
    },

    unbindAll: function() {
      for(var i in this.callbacks) {
        delete this.callbacks[i];
      }
    },

    emit: function(event, data) {
      this.dispatch(event, data);
      return this;
    },

    dispatch: function(event, data) {
      var callbacks = this.callbacks[event];

      if(callbacks !== undefined) {
        for(var i = 0; i < callbacks.length; i++) {
          var callbackObj = callbacks[i];
          callbackObj.callback.call(callbackObj.obj, data);
        }
      }
    }
  };
})(this);
