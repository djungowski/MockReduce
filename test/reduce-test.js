describe('Reduce tests', function() {
	it('exists', function() {
		expect(MockReduce.Reduce).not.toBeUndefined();
	});

	beforeEach(function() {
	    this.reduce = new MockReduce.Reduce();
	});

	describe('#run', function() {
		var mockData = [
			{ "_id": 42, "value": [7, 8, 32]},
			{ "_id": 1337, "value": [993, 323, 4434] },
			{ "_id": 23, "value": [111, 4324, 882] }
		];

	    it('calls the reduce function for every element of the data set', function() {
			var mapReduce = {
				reduce: function() {}
			};
			spyOn(mapReduce, 'reduce');
			this.reduce.run(mockData, mapReduce.reduce);
			expect(mapReduce.reduce.calls.count()).toEqual(3);
	    });
	});
});