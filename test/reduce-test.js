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

		describe('Data Reducing', function() {
			var reduce = function (key, values) {
				var total = 0;
				for(var i=0, valuesLength = values.length; i < valuesLength; i++) {
					total += values[i];
				}
				return total;
			};

			var expected = [
				{ "_id": 42, "value": 47},
				{ "_id": 1337, "value": 5750 },
				{ "_id": 23, "value": 5317 }
			];

			it('reduces the data', function () {
				this.reduce.run(mockData, reduce);
				expect(this.reduce.getReducedData()).toEqual(expected);
			});

			it('returns the data', function() {
				var reducedData = this.reduce.run(mockData, reduce);
				expect(reducedData).toEqual(expected);
			});

		    it('resets the reduced data after each run', function() {
				this.reduce.run(mockData, reduce);
				this.reduce.run(mockData, reduce);
				expect(this.reduce.getReducedData()).toEqual(expected);
		    });
		});
	});
});