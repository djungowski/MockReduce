MockReduce = function() {
	this._map = new MockReduce.Map();
};

MockReduce.prototype._map = null;
MockReduce.prototype._nextTestData = null;

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

	this._emits = [];
	for (var i in testData) {
		if (!testData.hasOwnProperty(i)) {
			continue;
		}
		window.emit = function(key, value) {
			me.emit(key, value);
		};

		mapReduce.map.apply(testData[i]);
		window.emit = undefined;
	}
};