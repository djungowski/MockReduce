require('./src/mock-reduce');
require('./src/scope');
require('./src/map');
require('./src/reduce');
require('./src/installer');

var mockReduce = MockReduce.init();
mockReduce.setInstaller(new MockReduce.Installer());
module.exports = mockReduce;