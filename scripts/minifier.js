// Produces the minified version.

var packer = require( 'node.packer' ),
    path   = __dirname + '/../',
    src    = path,
    out    = path;

var input = [
  src + 'andro.js',
];

packer({
  log: true,
  input: input,
  minify: true,
  output: out + 'andro-min.js',
  callback: function ( err, code ){
    err && console.log( err );
  }
});
