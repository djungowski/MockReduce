MockReduce.Map = function() {
	this._resetState();
};

MockReduce.Map.prototype._emits = null;
MockReduce.Map.prototype._mappedData = null;

MockReduce.Map.prototype._resetState = function () {
	this._resetEmits();
	this._resetMappedData();
};

MockReduce.Map.prototype._resetEmits = function () {
	this._emits = [];
};

MockReduce.Map.prototype._resetMappedData = function () {
	this._mappedData = {};
};

MockReduce.Map.prototype.run = function (testData, mapFunction) {
	var me = this;

	this._resetState();
	window.emit = function(key, value) {
		me.emit(key, value);
	};
	for (var i in testData) {
		if (!testData.hasOwnProperty(i)) {
			continue;
		}

		mapFunction.apply(testData[i]);
	}
	window.emit = undefined;

	return this.getMappedData();
};

MockReduce.Map.prototype.emit = function (key, value) {
	var mappedData = {
		"_id": key,
		"value": value
	};
	this._emits.push(mappedData);
	this._groupMappedData(mappedData);

	return mappedData;
};

MockReduce.Map.prototype.getEmits = function () {
	return this._emits;
};

MockReduce.Map.prototype.getMappedData = function () {
	var mappedData = this._mappedData;
	return Object.keys(mappedData).map(function (key) {return mappedData[key]});
};

MockReduce.Map.prototype._groupMappedData = function (mappedData) {
	if (this._mappedData[mappedData._id] == undefined) {
		this._mappedData[mappedData._id] = {
			"_id": mappedData._id,
			"value": []
		};
	}
	this._mappedData[mappedData._id].value.push(mappedData.value);
};