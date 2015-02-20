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
	this._map.run(testData, mapReduce.map);
};