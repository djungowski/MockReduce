MockReduce.Reduce = function() {
	this._resetReducedData();
};

MockReduce.Reduce.prototype._reducedData = null;

MockReduce.Reduce.prototype._resetReducedData = function () {
	this._reducedData = [];
};

MockReduce.Reduce.prototype.run = function (testData, reduceFunction) {
	this._resetReducedData();

	for (var i in testData) {
		if (!testData.hasOwnProperty(i)) {
			continue;
		}
		var id = testData[i]._id;
		this._reducedData.push({
			"_id": id,
			"value": reduceFunction(id, testData[i].value)
		});
	}

	return this.getReducedData();
};

MockReduce.Reduce.prototype.getReducedData = function () {
	return this._reducedData;
};