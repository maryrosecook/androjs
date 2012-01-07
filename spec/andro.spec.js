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

describe('setupOwner', function(){

  it('should put behaviours on passed object', function(){
    andro.setupOwner(obj);
    expect(obj.behaviours).toBeDefined();
  });

  it('should put eventer on behaviours', function(){
    andro.setupOwner(obj);
    expect(obj.behaviours.eventer.bind).toBeDefined();
  });

  it('should throw error if setup called twice on one obj', function(){
    andro.setupOwner(obj);

    expect(function(){
      andro.setupOwner(obj)
    }).toThrow("Object already set up, or has conflicting property called behaviours.");
  });
});

describe('augmentOwner', function(){
  var basicBehaviour = null;

  beforeEach(function () {
    basicBehaviour = {
      name: "Behaviour",
      woo: 1,
      blah: function() {}
    };
  });

  it('should throw error if called on obj not set up', function(){
    expect(function(){
      andro.augmentOwner(obj, {});
    }).toThrow("This object is not set up for Andro.");
  });

  it('should throw error if no behaviour passed', function(){
    andro.setupOwner(obj);

    expect(function(){
      andro.augmentOwner(obj);
    }).toThrow("You must pass a behaviour with which to augment the owner.");
  });

  it('should throw error if behaviour has no name attribute', function(){
    var behaviour = {};
    andro.setupOwner(obj);

    expect(function(){
      andro.augmentOwner(obj, behaviour);
    }).toThrow("Behaviours must have a 'name' attribute.");
  });

  it('should throw error if behaviour passed called eventer', function(){
    var behaviour = { name: "eventer" };
    andro.setupOwner(obj);

    expect(function(){
      andro.augmentOwner(obj, behaviour);
    }).toThrow("You may not call your behaviour 'eventer'. This word is reserved for internal use.");
  });

  it('should not require behaviour has a setup function', function(){
    var behaviour = {
      name: "Behaviour",
    };

    andro.setupOwner(obj);
    andro.augmentOwner(obj, behaviour); // no error thrown
  });

  it('should write attributes of passed behaviour to owner', function(){
    andro.setupOwner(obj);
    andro.augmentOwner(obj, basicBehaviour);

    expect(typeof(obj.behaviours[basicBehaviour.name].blah)).toEqual('function');
    expect(typeof(obj.behaviours[basicBehaviour.name].woo)).toEqual('number');
  });

  it('should call setup function on behaviour if specified', function(){
    basicBehaviour.setup = function() {
      this.yeah = true;
    };

    andro.setupOwner(obj);
    andro.augmentOwner(obj, basicBehaviour);

    expect(obj.behaviours[basicBehaviour.name].yeah).toEqual(true);
  });

  it('should write exports from setup to main obj', function() {
    basicBehaviour.setup = function() {
      return {
        "getWoo": function() {}
      }
    };

    andro.setupOwner(obj);
    andro.augmentOwner(obj, basicBehaviour);

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

    andro.setupOwner(obj);
    andro.augmentOwner(obj, basicBehaviour);

    expect(obj.getWoo()).toEqual(1);
  });

  it('should throw exception if behaviour export clashes with owner property', function() {
    basicBehaviour.setup = function() {
      return {
        "woo": function() { }
      }
    };

    obj.woo = "whatever";
    andro.setupOwner(obj);
    expect(function(){
      andro.augmentOwner(obj, basicBehaviour);
    }).toThrow(basicBehaviour.name + " export would overwrite existing attribute on owner.");
  });
});

describe('behaviour', function(){
  var behaviour1 = null;
  var behaviour2 = null;

  beforeEach(function () {
    behaviour1 = { name: "Behaviour1" };
    behaviour2 = { name: "Behaviour2" };
  });

  it('should return right behaviour', function(){
    andro.setupOwner(obj);
    andro.augmentOwner(obj, behaviour1);
    andro.augmentOwner(obj, behaviour2);

    expect(andro.behaviour(obj, behaviour2.name).name).toEqual("Behaviour2");
  });

  it('should return undefined if no such behaviour', function(){
    andro.setupOwner(obj);
    expect(andro.behaviour(obj, "noway")).not.toBeDefined();
  });

  it('should throw error if called on obj not set up', function(){
    expect(function(){
      andro.behaviour(obj, "whatever");
    }).toThrow("This object is not set up for Andro.");
  });
});

describe('eventer', function(){
  it('should return eventer', function(){
    andro.setupOwner(obj);
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
    andro.setupOwner(obj);
    expect(andro.isSetup(obj)).toEqual(true);
  });

  it('should return false if obj not setup', function(){
    expect(andro.isSetup(obj)).toEqual(false);
  });
});

describe('checkIsSetup', function(){
  it('should return true if obj setup', function(){
    andro.setupOwner(obj);
    expect(andro.isSetup(obj)).toEqual(true);
  });

  it('should throw error if called on obj not set up', function(){
    expect(function(){
      andro.eventer(obj, "whatever");
    }).toThrow("This object is not set up for Andro.");
  });
});