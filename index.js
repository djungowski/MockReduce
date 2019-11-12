const MockReduce = require("./src/mock-reduce");
const Installer = require("./src/installer");
const MockReduceMap = require("./src/map");
const Scope = require("./src/scope");
const Reduce = require("./src/reduce");

const globalScope = Scope.getGlobalScope();
const map = new MockReduceMap(new Scope(globalScope));
const reduce = new Reduce();
const scope = new Scope(globalScope);

const mockReduce = new MockReduce(map, reduce, scope);
mockReduce.setInstaller(new Installer());

module.exports = mockReduce;
