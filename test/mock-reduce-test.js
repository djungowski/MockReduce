describe('Mock Reduce Test', function() {
    it('exists', function() {
        expect(MockReduce).not.toBeUndefined();
    });

	beforeEach(function() {
	    this.mockReduce = new MockReduce();
	});

	describe('#map', function() {
	    it('is called for every element of the data set', function() {
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

		it('maps the data', function() {
		    var mapReduce = {
				map: function() {
					emit(42, this.first)
				}
			};
			var mockData = [
				{first: 'foo'},
				{first: 'bar'}
			];
			var expectedMappedData = [
				{"_id": 42, value: "foo"},
				{"_id": 42, value: "bar"}
			];

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce);
			var actualMappedData = this.mockReduce.getEmits();
			expect(actualMappedData).toEqual(expectedMappedData);
		});
	});

	describe('emit', function() {
	    it('returns what is put into it as an object', function() {
			var key = 1337;
			var value = {
				Banana: "Stand"
			};
	        var expected = {
				"_id": key,
				"value": value
			};
			var actual = this.mockReduce.emit(key, value);
			expect(actual).toEqual(expected);
	    });
	});
});