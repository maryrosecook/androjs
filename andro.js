;(function() {
  function Andro() {};

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

  var makeFn = function(fn, behaviour, args) {
    return function() {
      return fn.call(behaviour, args);
    };
  };

  Andro.prototype = {
    setupOwner: function(owner) {
      if(this.isSetup(owner)) {
        throw "Object already set up, or has conflicting property called behaviours.";
      }
      else {
        owner.behaviours = {};
        owner.behaviours.eventer = new Eventer();
      }
    },

    augmentOwner: function(owner, behaviourMixin) {
      if(!this.checkIsSetup(owner)) {
        return;
      }

      if(behaviourMixin === undefined) {
        throw "You must pass a behaviour with which to augment the owner.";
      }

      if(behaviourMixin.name === undefined) {
        throw "Behaviours must have a 'name' attribute.";
      }

      if(behaviourMixin.name === "eventer") {
        throw "You may not call your behaviour 'eventer'. This word is reserved for internal use.";
      }

      owner.behaviours[behaviourMixin.name] = {};
      var behaviour = extend(owner.behaviours[behaviourMixin.name], behaviourMixin);

      // write exports to owner
      if(owner.behaviours[behaviour.name].setup !== undefined) {
        var exports = owner.behaviours[behaviour.name].setup(owner);
        for(var name in exports) {
          if(owner[name] === undefined) {
            owner[name] = makeFn(exports[name], behaviour, arguments);
          }
          else {
            throw behaviour.name + " export would overwrite existing attribute on owner.";
          }
        }
      }
    },

    getBehaviour: function(owner, behaviourName) {
      if(this.checkIsSetup(owner)) {
        return owner.behaviours[behaviourName];
      }
    },

    getEventer: function(owner) {
      if(this.checkIsSetup(owner)) {
        return owner.behaviours.eventer;
      }
    },

    // Returns true if owner has behaviours set up on it.
    isSetup: function(owner) {
      return owner.behaviours !== undefined;
    },

    // Returns true if owner has behaviours set up on it, or throws exception if it doesn't.
    checkIsSetup: function(owner) {
      if(this.isSetup(owner)) {
        return true;
      }

      throw "This object is not set up for andro.";
    }
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
