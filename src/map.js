MockReduce.Map = function() {};

MockReduce.Map.prototype._emits = [];

MockReduce.Map.prototype.run = function (testData, mapFunction) {
	var me = this;
	for (var i in testData) {
		if (!testData.hasOwnProperty(i)) {
			continue;
		}
		window.emit = function(key, value) {
			me.emit(key, value);
		};

		mapFunction.apply(testData[i]);
		window.emit = undefined;
	}
};

MockReduce.Map.prototype.emit = function (key, value) {
	var mappedData = {
		"_id": key,
		"value": value
	};
	this._emits.push(mappedData);
//	this._groupMappedData(mappedData);

	return mappedData;
};

MockReduce.Map.prototype.getEmits = function () {
	return this._emits;
};

MockReduce.prototype.getMappedData = function () {

};

MockReduce.prototype._groupMappedData = function () {

};