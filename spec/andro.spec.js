var andro = require('../andro').andro;

var obj = null;
beforeEach(function () {
  obj = {};
});

describe('andro basics', function(){
  it('should instantiate', function(){
    expect(typeof(andro)).toEqual('object');
  });
});

describe('tearDown', function(){
  it('should remove .andro from owner obj', function(){
    andro.augment(obj, {});
    expect(obj.andro).toBeDefined();
    andro.tearDown(obj);
    expect(obj.andro).toBeUndefined();
  });

  it('should remove all callbacks from eventer', function(){
    var eventer = andro.eventer(obj);

    // bind to two events
    var calledA = 0, calledB = 0;
    eventer.bind({}, "eventA", function() {
      calledA++;
    });
    eventer.bind({}, "eventB", function() {
      calledB++;
    });

    eventer.emit("eventA");
    eventer.emit("eventB");
    expect(calledA).toEqual(1);
    expect(calledB).toEqual(1);

    andro.tearDown(obj);

    eventer.emit("eventA");
    eventer.emit("eventB");
    expect(calledA).toEqual(1);
    expect(calledB).toEqual(1);
  });

  it('should not throw error if called on object not setup for andro', function(){
    andro.tearDown(obj);
  });
});

describe('augment', function(){
  var basicBehaviour = null;

  beforeEach(function () {
    basicBehaviour = {
      woo: 1,
      blah: function() {}
    };
  });

  it('should throw error if no behaviour passed', function(){
    expect(function(){
      andro.augment(obj);
    }).toThrow("You must pass a behaviour with which to augment the owner.");
  });

  it('should not require behaviour has a setup function', function(){
    andro.augment(obj, {}); // no error thrown
  });

  it('should write attributes of passed behaviour to owner', function(){
    andro.augment(obj, basicBehaviour);

    expect(typeof(obj.andro.behaviours[0].blah)).toEqual('function');
    expect(typeof(obj.andro.behaviours[0].woo)).toEqual('number');
  });

  it('should call setup function on behaviour if specified', function(){
    basicBehaviour.setup = function() {
      this.yeah = true;
    };

    andro.augment(obj, basicBehaviour);
    expect(obj.andro.behaviours[0].yeah).toEqual(true);
  });

  it('should pass owner into setup() when called on behaviour', function(){
    basicBehaviour.setup = function(owner, eventer) {
      expect(owner).toEqual(obj);
    };

    andro.augment(obj, basicBehaviour);
  });

  it('should pass eventer into setup() when called on behaviour', function(){
    basicBehaviour.setup = function(owner, eventer) {
      andro.eventer(obj).dispatch !== undefined; // double check returns eventer
      expect(eventer).toEqual(andro.eventer(obj));
    };

    andro.augment(obj, basicBehaviour);
  });

  it('should pass settings into setup() when called on behaviour', function(){
    basicBehaviour.setup = function(owner, eventer, settings) {
      this.yeah = true;
      expect(settings.woohoo).toEqual("yes");
    };

    andro.augment(obj, basicBehaviour, {
      woohoo: "yes"
    });

    expect(obj.andro.behaviours[0].yeah).toEqual(true);
  });

  it('should pass empty obj into setup() when called on behaviour if no settings', function(){
    basicBehaviour.setup = function(owner, eventer, settings) {
      this.yeah = true;
      expect(settings).toEqual({});
    };

    andro.augment(obj, basicBehaviour);

    expect(obj.andro.behaviours[0].yeah).toEqual(true);
  });

  it('should write exports from setup to main obj', function() {
    basicBehaviour.setup = function() {
      return {
        "getWoo": function() {}
      }
    };

    andro.augment(obj, basicBehaviour);

    expect(typeof(obj.getWoo)).toEqual('function');
  });

  it('should call exported functions with the behaviour of the context', function() {
    basicBehaviour.setup = function() {
      return {
        "getWoo": function() {
          return this.woo;
        }
      }
    };

    andro.augment(obj, basicBehaviour);
    expect(obj.getWoo()).toEqual(1);
  });

  it('should throw exception if behaviour export clashes with owner property', function() {
    basicBehaviour.setup = function() {
      return {
        "woo": function() { }
      }
    };

    obj.woo = "whatever";
    expect(function(){
      andro.augment(obj, basicBehaviour);
    }).toThrow("Behaviour export would overwrite existing attribute on owner.");
  });
});

describe('eventer', function(){
  it('should return eventer', function(){
    var obj = {}
    andro.augment(obj, {});
    expect(andro.eventer(obj).bind).toBeDefined();
  });
});
