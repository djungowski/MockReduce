MockReduce = function() {};

MockReduce.prototype._nextTestData = null;

MockReduce.prototype.setNextTestData = function (nextTestData) {
	this._nextTestData = nextTestData;
};

MockReduce.prototype.getAndEmptyNextTestData = function () {
	var nextTestData = this._nextTestData;
	this._nextTestData = null;
	return nextTestData
};

MockReduce.prototype.run = function () {
	var testData = this.getAndEmptyNextTestData();
	for (var key in testData) {
		this.map();
	}
};

MockReduce.prototype.map = function () {

};