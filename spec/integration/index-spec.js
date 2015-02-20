describe('index.js test', function () {
	it('creates a MockReduce instance when requiring, requires all needed modules', function() {
		var mockReduce = require('../../index');

		var map = new MockReduce.Map(new MockReduce.Scope());
		var reduce = new MockReduce.Reduce();
		var scope = new MockReduce.Scope();
		var expected = new MockReduce(map, reduce, scope);

		var installer = new MockReduce.Installer();
		expected.setInstaller(installer);

		expect(mockReduce).toEqual(expected);
	});
});