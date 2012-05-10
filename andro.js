/*
  Andro.js
  by mary rose cook
  http://github.com/maryrosecook/androjs

  Mix behaviour into objects
*/

;(function() {
  function Andro() {};

  Andro.prototype = {
    // Sets up the passed owner object to use behaviours
    setup: function(owner) {
      if(this.isSetup(owner)) {
        throw "Object already set up, or has conflicting property called andro.";
      }
      else {
        owner.andro = {};
        owner.andro.behaviours = [];
        owner.andro.eventer = new Eventer();
      }
    },

    // Shuts down and removes ALL behaviours from passed owner object
    tearDown: function(owner) {
      if(this.checkIsSetup(owner)) {
        this.eventer(owner).unbindAll();
        delete owner.andro; // remove andro from owner object
      }
    },

    // Adds the passed behaviour to the passed owner
    augment: function(owner, behaviourMixin, settings) {
      this.checkIsSetup(owner);
      if(behaviourMixin === undefined) {
        throw "You must pass a behaviour with which to augment the owner.";
      }

      var behaviour = {};
      owner.andro.behaviours.push(behaviour);
      extend(behaviour, behaviourMixin);

      // write exports to owner
      if(behaviour.setup !== undefined) {
        if(settings === undefined) {
          settings = {};
        }

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

      return name; // return just in case user wants to do something mental
    },

    // Returns eventer obj for passed owner object
    eventer: function(owner) {
      if(this.checkIsSetup(owner)) {
        return owner.andro.eventer;
      }
    },

    // Returns true if owner has andro obj on it.
    isSetup: function(owner) {
      return owner.andro !== undefined;
    },

    // Returns true if owner has andro obj on it, or throws exception if it doesn't.
    checkIsSetup: function(owner) {
      if(this.isSetup(owner)) {
        return true;
      }

      throw "This object is not set up for Andro.";
    }
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
      for(var i in this.callbacks) {
        if(this.callbacks[i].obj === obj) {
          delete this.callbacks[i];
          break;
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

  this.Andro = Andro;
}).call(this);
