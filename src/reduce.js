MockReduce.Reduce = function() {};

MockReduce.Reduce.prototype.run = function (testData, reduceFunction) {
	for (var i in testData) {
		reduceFunction();
	}
};