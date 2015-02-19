describe('Mock Reduce Test', function() {
    it('exists', function() {
        expect(MockReduce).not.toBeUndefined();
    });

	describe('#map', function() {
	    it('is called for every element of the data set', function() {
	        var mockReduce = new MockReduce();
			spyOn(mockReduce, 'map').and.callThrough();

			var mockData = [
				{first: "data"},
				{second: "data"},
				{third: "data"},
				{fourth: "data"},
				{fifth: "data"}
			];

			mockReduce.setNextTestData(mockData);
			mockReduce.run();
			expect(mockReduce.map.calls.count()).toEqual(5);
	    });
	});
});