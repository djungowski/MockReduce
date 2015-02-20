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
	});

	describe('#getEmits', function() {
		it('stores the emits', function() {
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

			this.map.run(mockData, map);
			var actualEmits = this.map.getEmits();
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