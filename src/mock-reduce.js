const Scope = require("./scope");
const MockReduceMap = require("./map");
const Reduce = require("./reduce");
const Installer = require("./installer");

class MockReduce {
  constructor(map, reduce, scope) {
    /**
     * Instance of MockReduce.Map
     *
     * @type {MockReduce.Map}
     * @private
     */
    this.map = map;

    /**
     * Instance of MockReduce.Reduce
     *
     * @type {MockReduce.Reduce}
     * @private
     */
    this.reduce = reduce;

    /**
     * Instance of MockReduce.Scope
     *
     * @type {MockReduce.Scope}
     * @private
     */
    this._scope = scope;

    /**
     * Data for the next MapReduce call
     *
     * @type {Array}
     * @private
     */
    this._nextTestData = null;

    /**
     * The installer instance
     *
     * @type {MockReduce.Installer}
     * @private
     */
    this._installer = null;
  }

  /**
   * Initialize a working MockReduce instance
   *
   * @returns {MockReduce}
   */
  static init() {
    var globalScope;
    if (typeof window != "undefined") {
      globalScope = window;
    } else if (typeof global != "undefined") {
      globalScope = global;
    } else {
      globalScope = {};
    }

    var map = new MockReduceMap(new Scope(globalScope));
    var reduce = new Reduce();
    var scope = new Scope(globalScope);
    return new MockReduce(map, reduce, scope);
  }

  /**
   * Set the data for the next MapReduce call
   *
   * @param nextTestData
   */
  setNextTestData(nextTestData) {
    this._nextTestData = nextTestData;
  }

  /**
   * Get the test data and empty it
   *
   * @returns {Array}
   * @private
   */
  _getAndEmptyNextTestData() {
    var nextTestData = this._nextTestData;
    this._nextTestData = null;
    return nextTestData;
  }

  /**
   * Run mock reduce for the provided map reduce definition
   *
   * @param mapReduce
   * @param doneCallback
   * @returns {Array}
   */
  run(mapReduce, doneCallback) {
    var testData = this._getAndEmptyNextTestData();

    if (testData == null) {
      return [];
    }

    this._scope.expose(mapReduce.scope);
    var mappedData = this.map.run(testData, mapReduce.map);
    var reducedData = this.reduce.run(mappedData, mapReduce.reduce);
    if (typeof mapReduce.finalize == "function") {
      reducedData = this.reduce.run(reducedData, mapReduce.finalize);
    }
    this._scope.concealAll();

    if (typeof doneCallback == "function") {
      doneCallback(null, reducedData);
    }

    return reducedData;
  }

  mapReduce() {
    var mapReduce, doneCallback;

    if (typeof arguments[0] == "function") {
      var options = arguments[2] || {};
      doneCallback = arguments[3];

      mapReduce = {
        map: arguments[0],
        reduce: arguments[1]
      };

      if (options.finalize != undefined) {
        mapReduce.finalize = options.finalize;
      }

      if (options.scope != undefined) {
        mapReduce.scope = options.scope;
      }
    } else {
      mapReduce = arguments[0];
      doneCallback = arguments[1];
    }

    return this.run(mapReduce, doneCallback);
  }

  /**
   * Set an installer
   *
   * @param installer
   */
  setInstaller(installer) {
    this._installer = installer;
  }

  /**
   * Run the installer#install method
   *
   * @param connector
   */
  install(connector) {
    if (this._installer == null) {
      throw "No installer defined";
    }
    this._installer.install(connector, this);
  }

  /**
   * Run the installer#uninstall method
   *
   */
  uninstall() {
    if (this._installer == null) {
      throw "No installer defined";
    }
    this._installer.uninstall();
  }
}

module.exports = MockReduce;