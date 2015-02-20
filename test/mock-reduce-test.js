describe('Mock Reduce Test', function() {
    it('exists', function() {
        expect(MockReduce).not.toBeUndefined();
    });

	beforeEach(function() {
	    this.mockReduce = new MockReduce();
	});

	describe('#run', function() {
	    it('calls map for every element of the data set', function() {
			var mapReduce = {
				map: function() {}
			};
			spyOn(mapReduce, 'map').and.callThrough();

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