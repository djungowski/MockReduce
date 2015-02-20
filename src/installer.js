MockReduce.Installer = function() {};

MockReduce.Installer.prototype._connector = null;
MockReduce.Installer.prototype._originalConnect = null;
MockReduce.Installer.prototype._originalCreateConnection = null;

MockReduce.Installer.prototype.install = function(connector) {
	this._connector = connector;
	this._originalConnect = connector.connect;
	connector.connect = function() {};

	if (connector.createConnection != undefined) {
		this._originalCreateConnection = connector.createConnection;
		connector.createConnection = function() {};
	}
};

MockReduce.Installer.prototype.uninstall = function () {
	this._connector.connect = this._originalConnect;
	this._connector.createConnection = this._originalCreateConnection;
};