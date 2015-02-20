/**
 * @constructor
 */
MockReduce.Installer = function() {};

/**
 * The original connector
 *
 * @type {MongoClient|Mongoose}
 * @private
 */
MockReduce.Installer.prototype._connector = null;

/**
 * The original connect() function of the connector
 *
 * @type {function}
 * @private
 */
MockReduce.Installer.prototype._originalConnect = null;

/**
 * The original createConnection() function of the connector
 *
 * @type {function}
 * @private
 */
MockReduce.Installer.prototype._originalCreateConnection = null;

/**
 * The original model() function of the connector
 *
 * @type {function}
 * @private
 */
MockReduce.Installer.prototype._originalModel = null;

MockReduce.Installer.prototype.CONNECTOR_TYPE = {
	NATIVE: 'native',
	MONGOOSE: 'mongoose'
};

/**
 * Install MockReduce for a MongoClient or Mongoose connector
 *
 * @param connector
 * @param mockReduce
 */
MockReduce.Installer.prototype.install = function(connector, mockReduce) {
	this._connector = connector;
	this._installConnect(mockReduce);
	this._installCreateConnection();
	this._installModel(mockReduce);
};

/**
 * Determines the connector type
 *
 * @returns {string}
 * @private
 */
MockReduce.Installer.prototype._determineConnectorType = function () {
	if (this._connectorHasCreateConnection()) {
		return this.CONNECTOR_TYPE.MONGOOSE;
	}
	return this.CONNECTOR_TYPE.NATIVE;
};

/**
 * Check if connector has a .createConnection method
 *
 * @returns {boolean}
 * @private
 */
MockReduce.Installer.prototype._connectorHasCreateConnection = function () {
	return (this._connector.createConnection != undefined);
};

/**
 * Install the .connect method
 *
 * @private
 */
MockReduce.Installer.prototype._installConnect = function (mockReduce) {
	this._originalConnect = this._connector.connect;
	this._connector.connect = function(url, callback) {
		var returnMockReduce = function () {
			return mockReduce;
		};
		callback(null, {collection: returnMockReduce});
	};
};

/**
 * Install the .createConnection method
 *
 * @private
 */
MockReduce.Installer.prototype._installCreateConnection = function () {
	if (this._connectorHasCreateConnection()) {
		this._originalCreateConnection = this._connector.createConnection;
		this._connector.createConnection = function() {};
	}
};

/**
 * Install the .model method
 *
 * @param mockReduce
 * @private
 */
MockReduce.Installer.prototype._installModel = function (mockReduce) {
	if (this._connector.model != undefined) {
		this._originalModel = this._connector.model;

		var me = this;
		this._connector.model = function (name, schema, collection, skipInit) {
			var model = me._originalModel.call(me._connector, name, schema, collection, skipInit);
			model.mapReduce = function () {
				mockReduce.mapReduce.apply(mockReduce, arguments);
			};
			return model;
		}
	}
};

/**
 * Uninstall MockReduce and restore the original connector
 * 
 */
MockReduce.Installer.prototype.uninstall = function () {
	this._connector.connect = this._originalConnect;
	if(this._originalCreateConnection != null) {
		this._connector.createConnection = this._originalCreateConnection;
	}
	if(this._originalModel != null) {
		this._connector.model = this._originalModel;
	}
};