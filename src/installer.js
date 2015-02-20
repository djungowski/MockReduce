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
 * Install the .connect method
 *
 * @private
 */
MockReduce.Installer.prototype._installConnect = function (mockReduce) {
	this._originalConnect = this._connector.connect;
	this._connector.connect = function(url, callback) {
		callback(null, mockReduce);
	};
};

/**
 * Install the .createConnection method
 *
 * @private
 */
MockReduce.Installer.prototype._installCreateConnection = function () {
	if (this._connector.createConnection != undefined) {
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

		this._connector.model = function () {
			return mockReduce;
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