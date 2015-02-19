MockReduce = function() {};

MockReduce.prototype._nextTestData = null;
MockReduce.prototype._mappedData = [];

MockReduce.prototype.setNextTestData = function (nextTestData) {
	this._nextTestData = nextTestData;
};

MockReduce.prototype.getAndEmptyNextTestData = function () {
	var nextTestData = this._nextTestData;
	this._nextTestData = null;
	return nextTestData
};

MockReduce.prototype.run = function (mapReduce) {
	var me = this;
	var testData = this.getAndEmptyNextTestData();

	this._mappedData = [];
	for (var i in testData) {
		(function() {
			window.emit = function(key, value) {
				me.emit(key, value);
			};

			mapReduce.map.apply(testData[i]);
			window.emit = undefined;
		})();
	}

	return this._mappedData;
};

MockReduce.prototype.getMappedData = function () {
	return this._mappedData;
};

MockReduce.prototype.emit = function (key, value) {
	var mappedData = {
		"_id": key,
		"value": value
	};

	this._mappedData.push(mappedData);

	return mappedData;
};