describe('Mock Reduce Test', function() {
    it('exists', function() {
        expect(MockReduce).not.toBeUndefined();
    });

	beforeEach(function() {
		this.mapMock = {
			run: function() {}
		};

		this.reduceMock = {
			run: function() {}
		};

		this.scopeMock = {
			expose: function() {},
			concealAll: function() {}
		};

	    this.mockReduce = new MockReduce(this.mapMock, this.reduceMock, this.scopeMock);
	});

	describe('#run', function() {
		var mockData = [
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"}
		];

		var mappedData = [
			{"_id": 42, "value": [1337, 2, 4, 6, 77]},
			{"_id": 1337, "value": [0, 0, 1, 2]}
		];

		var reducedData = [
			{"_id": 42, "value": "A Flight to Remember"},
			{"_id": 1337, "value": "A Tale of Two Santas"}
		];

		var finalizedData = [
			{"_id": 42, "value": "Mars University"},
			{"_id": 1337, "value": "Bendin' in the Wind"}
		];

	    it('calls map and reduce with the correct data and returns the correct data', function() {
			var mapReduce = {
				map: function() {},
				reduce: function() {}
			};
			spyOn(this.mapMock, 'run').and.returnValue(mappedData);
			spyOn(this.reduceMock, 'run').and.returnValue(reducedData);

			this.mockReduce.setNextTestData(mockData);
			var actual = this.mockReduce.run(mapReduce);
			expect(this.mapMock.run).toHaveBeenCalledWith(mockData, mapReduce.map);
			expect(this.reduceMock.run).toHaveBeenCalledWith(mappedData, mapReduce.reduce);
			expect(actual).toEqual(reducedData);
	    });

		it('calls map, reduce and finalize with the correct data and returns the correct data', function () {
			var mapReduce = {
				map: function() {},
				reduce: function() {},
				finalize: function() {}
			};
			var me = this;
			spyOn(this.mapMock, 'run').and.returnValue(mappedData);
			spyOn(this.reduceMock, 'run').and.callFake(function () {
				if (me.reduceMock.run.calls.count() == 1) {
					return reducedData;
				}
				return finalizedData;
			});

			this.mockReduce.setNextTestData(mockData);
			var actual = this.mockReduce.run(mapReduce);
			expect(this.mapMock.run).toHaveBeenCalledWith(mockData, mapReduce.map);
			expect(this.reduceMock.run.calls.argsFor(0)).toEqual([mappedData, mapReduce.reduce]);
			expect(this.reduceMock.run.calls.argsFor(1)).toEqual([reducedData, mapReduce.finalize]);
			expect(this.reduceMock.run.calls.count()).toEqual(2);
			expect(actual).toEqual(finalizedData);
		});

		it('only uses the test data once, returns empty array if no testData is provided', function() {
			var mapReduce = {
				map: function() {},
				reduce: function() {}
			};
			spyOn(this.mapMock, 'run');
			spyOn(this.reduceMock, 'run');

			var mockData = [
				{first: "data"}
			];

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce);
			expect(this.mapMock.run.calls.count()).toEqual(1);
			expect(this.reduceMock.run.calls.count()).toEqual(1);

			this.mapMock.run.calls.reset();
			this.reduceMock.run.calls.reset();

			var actual = this.mockReduce.run(mapReduce);
			expect(this.mapMock.run.calls.count()).toEqual(0);
			expect(this.reduceMock.run.calls.count()).toEqual(0);
			expect(actual).toEqual([]);
		});
//
//		it('exposes and conceals all given scope variables', function() {
//			var mapReduce = {
//				scope: {
//					value: "does not matter"
//				},
//				map: function() {},
//				reduce: function() {}
//			};
//
//			spyOn(this.mockReduce._scope, 'expose');
//			spyOn(this.mockReduce._scope, 'concealAll');
//			this.mockReduce.run(mapReduce);
//			expect(this.mockReduce._scope.expose).toHaveBeenCalledWith(mapReduce.scope);
//			expect(this.mockReduce._scope.concealAll).toHaveBeenCalled();
//		});
	});
});