class Installer {
  constructor() {
    /**
     * The original connector
     *
     * @type {MongoClient|Mongoose}
     * @private
     */
    this._connector = null;

    /**
     * The original connect() function of the connector
     *
     * @type {function}
     * @private
     */
    this._originalConnect = null;

    /**
     * The original createConnection() function of the connector
     *
     * @type {function}
     * @private
     */
    this._originalCreateConnection = null;

    /**
     * The original model() function of the connector
     *
     * @type {function}
     * @private
     */
    this._originalModel = null;

    /**
     * Is MockReduce currently installed?
     *
     * @type {boolean}
     * @private
     */
    this._isInstalled = false;

    /**
     * Available connector types
     *
     * @type {{NATIVE: string, MONGOOSE: string}}
     */
    this.CONNECTOR_TYPE = {
      NATIVE: "native",
      MONGOOSE: "mongoose"
    };
  }

  /**
   * Install MockReduce for a MongoClient or Mongoose connector
   *
   * @param connector
   * @param mockReduce
   */
  install(connector, mockReduce) {
    if (!this._isInstalled) {
      this._connector = connector;
      this._installConnect(mockReduce);
      this._installCreateConnection();
      this._installModel(mockReduce);
      this._isInstalled = true;
    }
  }

  /**
   * Determines the connector type
   *
   * @returns {string}
   * @private
   */
  _determineConnectorType() {
    if (this._connectorHasCreateConnection()) {
      return this.CONNECTOR_TYPE.MONGOOSE;
    }
    return this.CONNECTOR_TYPE.NATIVE;
  }

  /**
   * Check if connector has a .createConnection method
   *
   * @returns {boolean}
   * @private
   */
  _connectorHasCreateConnection() {
    return this._connector.createConnection != undefined;
  }

  /**
   * Install the .connect method
   *
   * @private
   */
  _installConnect(mockReduce) {
    this._originalConnect = this._connector.connect;
    this._connector.connect = function(url, callback) {
      callback = callback || function() {};
      var returnMockReduce = function() {
        return mockReduce;
      };
      callback(null, { collection: returnMockReduce });
    };
  }

  /**
   * Install the .createConnection method
   *
   * @private
   */
  _installCreateConnection() {
    if (this._connectorHasCreateConnection()) {
      this._originalCreateConnection = this._connector.createConnection;
      this._connector.createConnection = function() {};
    }
  }

  /**
   * Install the .model method
   *
   * @param mockReduce
   * @private
   */
  _installModel(mockReduce) {
    if (this._connector.model != undefined) {
      this._originalModel = this._connector.model;

      var me = this;
      this._connector.model = function(name, schema, collection, skipInit) {
        var model = me._originalModel.call(
          me._connector,
          name,
          schema,
          collection,
          skipInit
        );
        model.mapReduce = function() {
          return mockReduce.mapReduce.apply(mockReduce, arguments);
        };
        return model;
      };
    }
  }

  /**
   * Uninstall MockReduce and restore the original connector
   *
   */
  uninstall() {
    this._connector.connect = this._originalConnect;
    if (this._originalCreateConnection != null) {
      this._connector.createConnection = this._originalCreateConnection;
    }
    if (this._originalModel != null) {
      this._connector.model = this._originalModel;
    }
    this._isInstalled = false;
  }
}

module.exports = Installer;
