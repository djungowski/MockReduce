const MockReduce = require('./src/mock-reduce');
const Installer = require('./src/installer')

var mockReduce = MockReduce.init();
mockReduce.setInstaller(new Installer());
module.exports = mockReduce;