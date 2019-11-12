const MockReduce = require('../../src/mock-reduce');
const MockReduceMap = require('../../src/map');
const Reduce = require('../../src/reduce');
const Scope = require('../../src/scope');
const Installer = require('../../src/installer');

describe('index.js test', function () {
	it('creates a MockReduce instance when requiring, requires all needed modules', function() {
		var mockReduce = require('../../index');

		var globalScope;
		if (typeof window != 'undefined') {
			globalScope = window;
		} else if (typeof global != 'undefined') {
			globalScope = global;
		} else {
			globalScope = {};
		}
		
		var map = new MockReduceMap(new Scope(globalScope));
		var reduce = new Reduce();
		var scope = new Scope(globalScope);
		var expected = new MockReduce(map, reduce, scope);

		var installer = new Installer();
		expected.setInstaller(installer);

		expect(mockReduce).toEqual(expected);
	});
});