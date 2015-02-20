MockReduce.Installer = function() {};

MockReduce.Installer.prototype.install = function(connector) {
	connector.connect = function() {};

	if (connector.createConnection != undefined) {
		connector.createConnection = function() {};
	}
};