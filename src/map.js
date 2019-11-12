class MockReduceMap {
  /**
   * @param scope
   * @constructor
   */
  constructor(scope) {
    /**
     * MockReduce.Scope instance
     *
     * @type {MockReduce.Scope}
     * @private
     */
    this._scope = scope;

    /**
     * Storage for all emits for the last map operation
     *
     * @type {Array}
     * @private
     */
    this._emits = null;

    /**
     * Storage for all mapped data for the last map operation
     *
     * @type {Array}
     * @private
     */
    this._mappedData = null;

    this._resetState();
  }

  /**
   * Reset state. Clears all emits and mapped data
   *
   * @private
   */
  _resetState() {
    this._resetEmits();
    this._resetMappedData();
  }

  /**
   * Resets all saved emits
   *
   * @private
   */
  _resetEmits() {
    this._emits = [];
  }

  /**
   * Resets als saved mapped data
   *
   * @private
   */
  _resetMappedData() {
    this._mappedData = {};
  }

  /**
   * Map a provided data set with a provided map function
   *
   * @param testData
   * @param mapFunction
   * @returns {Array}
   */
  run(testData, mapFunction) {
    this._resetState();
    this._exposeEmit();

    for (var i in testData) {
      if (!testData.hasOwnProperty(i)) {
        continue;
      }

      // Make sure that the current element from the data set is available as this in
      // the provided map function
      mapFunction.apply(testData[i]);
    }
    this._scope.concealAll();
    return this.getMappedData();
  }

  /**
   * Mock for MongoDBs emit functionality
   * Stores all emits and groups the data
   *
   * @param key
   * @param value
   * @returns {{_id: *, value: *}}
   */
  emit(key, value) {
    var mappedData = {
      _id: key,
      value: value
    };
    this._emits.push(mappedData);
    this._addMappedDataToItsIdGroup(mappedData);

    return mappedData;
  }

  /**
   * Expose emit functionality for all map operations
   *
   * @private
   */
  _exposeEmit() {
    var me = this;

    this._scope.expose({
      emit: function(key, value) {
        me.emit(key, value);
      }
    });
  }

  /**
   * Return all stored emits from the last map operation
   *
   * @returns {Array}
   */
  getEmits() {
    return this._emits;
  }

  /**
   * Return all stored mapped data from the last map operation
   *
   * @returns {Array}
   */
  getMappedData() {
    var mappedData = this._mappedData;
    return Object.keys(mappedData).map(function(key) {
      return mappedData[key];
    });
  }

  /**
   * Add a provided element from a data set to its id group
   * Create this group if it does not exist yet
   *
   * @param mappedData
   * @private
   */
  _addMappedDataToItsIdGroup(mappedData) {
    if (this._mappedData[mappedData._id] == undefined) {
      this._mappedData[mappedData._id] = {
        _id: mappedData._id,
        value: []
      };
    }
    this._mappedData[mappedData._id].value.push(mappedData.value);
  }
}

module.exports = MockReduceMap;
