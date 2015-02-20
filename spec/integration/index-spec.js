describe('index.js test', function () {
	it('creates a MockReduce instancen when requiring, requires all needed modules', function() {
		var mockReduce = require('../../index');

		var map = new MockReduce.Map(new MockReduce.Scope());
		var reduce = new MockReduce.Reduce();
		var scope = new MockReduce.Scope();
		var expected = new MockReduce(map, reduce, scope);

		expect(mockReduce).toEqual(expected);
	});
});