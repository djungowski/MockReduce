/**
 * @constructor
 */
MockReduce.Reduce = function() {
	this._resetReducedData();
};

/**
 * The complete set of reduced data
 *
 * @type {Array}
 * @private
 */
MockReduce.Reduce.prototype._reducedData = null;

/**
 * Reset the reduced data set for the next reduce operation
 *
 * @private
 */
MockReduce.Reduce.prototype._resetReducedData = function () {
	this._reducedData = [];
};

/**
 * Reduce a complete provided set of testData with the provided reduce function
 *
 * @param testData
 * @param reduceFunction
 * @returns {Array}
 */
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

/**
 * Return the complete set of reduced data from the last reduce operation
 *
 * @returns {Array}
 */
MockReduce.Reduce.prototype.getReducedData = function () {
	return this._reducedData;
};