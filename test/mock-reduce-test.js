describe('Mock Reduce Test', function() {
    it('exists', function() {
        expect(MockReduce).not.toBeUndefined();
    });

	beforeEach(function() {
	    this.mockReduce = new MockReduce();
	});

	describe('#run', function() {
		var mockData = [
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"}
		];

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

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce);
			expect(mapReduce.map.calls.count()).toEqual(5);
			expect(mapReduce.reduce.calls.count()).toEqual(5);
	    });

		it('calls map, reduce and finalize for every element of the data set', function () {
			var counter = 0;
			var mapReduce = {
				map: function() {
					emit(counter++, this.claptrap);
				},
				reduce: function() {},
				finalize: function() {}
			};
			spyOn(mapReduce, 'map').and.callThrough();
			spyOn(mapReduce, 'reduce');
			spyOn(mapReduce, 'finalize');

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce);
			expect(mapReduce.map.calls.count()).toEqual(5);
			expect(mapReduce.reduce.calls.count()).toEqual(5);
			expect(mapReduce.finalize.calls.count()).toEqual(5);
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

		it('exposes and conceals all given scope variables', function() {
			var mapReduce = {
				scope: {
					value: "does not matter"
				},
				map: function() {},
				reduce: function() {}
			};

			spyOn(this.mockReduce._scope, 'expose');
			spyOn(this.mockReduce._scope, 'concealAll');
			this.mockReduce.run(mapReduce);
			expect(this.mockReduce._scope.expose).toHaveBeenCalledWith(mapReduce.scope);
			expect(this.mockReduce._scope.concealAll).toHaveBeenCalled();
		});
	});
});