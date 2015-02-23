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
		
		var map = new MockReduce.Map(new MockReduce.Scope(globalScope));
		var reduce = new MockReduce.Reduce();
		var scope = new MockReduce.Scope(globalScope);
		var expected = new MockReduce(map, reduce, scope);

		var installer = new MockReduce.Installer();
		expected.setInstaller(installer);

		expect(mockReduce).toEqual(expected);
	});
});