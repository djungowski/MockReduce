describe('Map tests', function () {
	beforeEach(function() {
	    this.map = new MockReduce.Map();
	});

	describe('#run', function() {
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

			this.map.run(mockData, mapReduce.map);
			expect(mapReduce.map.calls.count()).toEqual(5);
		});

		it('groups the data', function() {
			var map = function () {
				emit(42, this.value);
			};
			var mockData = [
				{value: 'Cornballer'},
				{value: 'Uncle Father Oscar'},
				{value: 'Dead Dove DO NOT EAT'}
			];
			var mappedDataExpected = [
				{
					"_id": 42,
					"value": [
						'Cornballer',
						'Uncle Father Oscar',
						'Dead Dove DO NOT EAT'
					]
				}
			];
			this.map.run(mockData, map);
			var mappedDataActual = this.map.getMappedData();
			expect(mappedDataActual).toEqual(mappedDataExpected);
		});
	});

	describe('#getEmits', function() {
		var map = function() {
			emit(42, this.first)
		};
		var mockData = [
			{first: 'foo'},
			{first: 'bar'}
		];
		var expectedEmits = [
			{"_id": 42, value: "foo"},
			{"_id": 42, value: "bar"}
		];

		it('stores the emits', function() {
			this.map.run(mockData, map);
			var actualEmits = this.map.getEmits();
			expect(actualEmits).toEqual(expectedEmits);
		});

		it('resets the emits when running twice', function () {
			this.map.run(mockData, map);
			var actualEmits = this.map.getEmits();
			expect(actualEmits).toEqual(expectedEmits);
			this.map.run(mockData, map);
			actualEmits = this.map.getEmits();
			expect(actualEmits).toEqual(expectedEmits);
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
			var actual = this.map.emit(key, value);

			expect(actual).toEqual(expected);
		});
	});
});