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
 * Install MockReduce for a MongoClient or Mongoose connector
 *
 * @param connector
 */
MockReduce.Installer.prototype.install = function(connector) {
	this._connector = connector;
	this._originalConnect = connector.connect;
	connector.connect = function() {};

	if (connector.createConnection != undefined) {
		this._originalCreateConnection = connector.createConnection;
		connector.createConnection = function() {};
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
};