describe('Mock Reduce Test', function() {
    it('exists', function() {
        expect(MockReduce).not.toBeUndefined();
    });

	beforeEach(function() {
	    this.mockReduce = new MockReduce();
	});

	describe('#run', function() {
	    it('calls map and reduce for every element of the data set', function() {
			var counter = 0;
			var mapReduce = {
				map: function() {
					emit(counter++, 2);
				},
				reduce: function() {}
			};
			spyOn(mapReduce, 'map').and.callThrough();
			spyOn(mapReduce, 'reduce');

			var mockData = [
				{first: "data"},
				{second: "data"},
				{third: "data"},
				{fourth: "data"},
				{fifth: "data"}
			];

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce);
			expect(mapReduce.map.calls.count()).toEqual(5);
			expect(mapReduce.reduce.calls.count()).toEqual(5);
	    });

		it('only uses the test data once', function() {
			var mapReduce = {
				map: function() {}
			};
			spyOn(mapReduce, 'map').and.callThrough();

			var mockData = [
				{first: "data"}
			];

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce);
			expect(mapReduce.map.calls.count()).toEqual(1);
			this.mockReduce.run(mapReduce);
			expect(mapReduce.map.calls.count()).toEqual(1);
		});
	});
});