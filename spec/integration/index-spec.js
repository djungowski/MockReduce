const MockReduce = require("../../src/mock-reduce");
const MockReduceMap = require("../../src/map");
const Reduce = require("../../src/reduce");
const Scope = require("../../src/scope");
const Installer = require("../../src/installer");

describe("index.js test", function() {
  it("creates a MockReduce instance when requiring, requires all needed modules", function() {
    const requireUncached = require('../helpers/require-uncached');
    const mockReduce = requireUncached("../../index");
    
    const map = new MockReduceMap(new Scope(global));
    const reduce = new Reduce();
    const scope = new Scope(global);

    const expected = new MockReduce(map, reduce, scope);
    expected.setInstaller(new Installer());

    expect(mockReduce).toEqual(expected);
  });
});
