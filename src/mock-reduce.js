MockReduce = function() {};

MockReduce.prototype._nextTestData = null;

MockReduce.prototype.setNextTestData = function (nextTestData) {
	this._nextTestData = nextTestData;
};

MockReduce.prototype.run = function () {
	for (var key in this._nextTestData) {
		this.map();
	}
};

MockReduce.prototype.map = function () {

};