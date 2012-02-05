var Andro = require('../andro').Andro;

var andro = null;
var obj = null;
beforeEach(function () {
  andro = new Andro();
  obj = {};
});

describe('andro basics', function(){

  it('should instantiate', function(){
    expect(typeof(andro)).toEqual('object');
  });
});

describe('setup', function(){

  it('should put behaviours on passed object', function(){
    andro.setup(obj);
    expect(obj.andro.behaviours).toBeDefined();
  });

  it('should put eventer on behaviours', function(){
    andro.setup(obj);
    expect(obj.andro.eventer.bind).toBeDefined();
  });

  it('should throw error if setup called twice on one obj', function(){
    andro.setup(obj);

    expect(function(){
      andro.setup(obj)
    }).toThrow("Object already set up, or has conflicting property called andro.");
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

  it('should throw error if called on obj not set up', function(){
    expect(function(){
      andro.augment(obj, {});
    }).toThrow("This object is not set up for Andro.");
  });

  it('should throw error if no behaviour passed', function(){
    andro.setup(obj);

    expect(function(){
      andro.augment(obj);
    }).toThrow("You must pass a behaviour with which to augment the owner.");
  });

  it('should not require behaviour has a setup function', function(){
    var behaviour = {};
    andro.setup(obj);
    andro.augment(obj, behaviour); // no error thrown
  });

  it('should write attributes of passed behaviour to owner', function(){
    andro.setup(obj);
    andro.augment(obj, basicBehaviour);

    expect(typeof(obj.andro.behaviours[0].blah)).toEqual('function');
    expect(typeof(obj.andro.behaviours[0].woo)).toEqual('number');
  });

  it('should call setup function on behaviour if specified', function(){
    basicBehaviour.setup = function() {
      this.yeah = true;
    };

    andro.setup(obj);
    andro.augment(obj, basicBehaviour);

    expect(obj.andro.behaviours[0].yeah).toEqual(true);
  });

  it('should pass settings into setup() when called on behaviour', function(){
    basicBehaviour.setup = function(owner, settings) {
      this.yeah = true;
      expect(settings.woohoo).toEqual("yes");
    };

    andro.setup(obj);
    andro.augment(obj, basicBehaviour, {
      woohoo: "yes"
    });

    expect(obj.andro.behaviours[0].yeah).toEqual(true);
  });

  it('should pass empty obj into setup() when called on behaviour if no settings', function(){
    basicBehaviour.setup = function(owner, settings) {
      this.yeah = true;
      expect(settings).toEqual({});
    };

    andro.setup(obj);
    andro.augment(obj, basicBehaviour);

    expect(obj.andro.behaviours[0].yeah).toEqual(true);
  });

  it('should write exports from setup to main obj', function() {
    basicBehaviour.setup = function() {
      return {
        "getWoo": function() {}
      }
    };

    andro.setup(obj);
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

    andro.setup(obj);
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
    andro.setup(obj);
    expect(function(){
      andro.augment(obj, basicBehaviour);
    }).toThrow("Behaviour export would overwrite existing attribute on owner.");
  });
});

describe('eventer', function(){
  it('should return eventer', function(){
    andro.setup(obj);
    expect(andro.eventer(obj).bind).toBeDefined();
  });

  it('should throw error if called on obj not set up', function(){
    expect(function(){
      andro.eventer(obj, "whatever");
    }).toThrow("This object is not set up for Andro.");
  });
});

describe('isSetup', function(){
  it('should return true if obj setup', function(){
    andro.setup(obj);
    expect(andro.isSetup(obj)).toEqual(true);
  });

  it('should return false if obj not setup', function(){
    expect(andro.isSetup(obj)).toEqual(false);
  });
});

describe('checkIsSetup', function(){
  it('should return true if obj setup', function(){
    andro.setup(obj);
    expect(andro.isSetup(obj)).toEqual(true);
  });

  it('should throw error if called on obj not set up', function(){
    expect(function(){
      andro.eventer(obj, "whatever");
    }).toThrow("This object is not set up for Andro.");
  });
});