require('./src/mock-reduce');
require('./src/scope');
require('./src/map');
require('./src/reduce');

var mockReduce = MockReduce.init();
module.exports = mockReduce;