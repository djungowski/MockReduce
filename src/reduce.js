class Reduce {
  constructor() {
    /**
     * The complete set of reduced data
     *
     * @type {Array}
     * @private
     */
    this._reducedData = null;

    this._resetReducedData();
  }

  /**
   * Reset the reduced data set for the next reduce operation
   *
   * @private
   */
  _resetReducedData() {
    this._reducedData = [];
  }

  /**
   * Reduce a complete provided set of testData with the provided reduce function
   *
   * @param testData
   * @param reduceFunction
   * @returns {Array}
   */
  run(testData, reduceFunction) {
    this._resetReducedData();

    for (var i in testData) {
      if (!testData.hasOwnProperty(i)) {
        continue;
      }
      var id = testData[i]._id;
      this._reducedData.push({
        _id: id,
        value: reduceFunction(id, testData[i].value)
      });
    }

    return this.getReducedData();
  }

  /**
   * Return the complete set of reduced data from the last reduce operation
   *
   * @returns {Array}
   */
  getReducedData() {
    return this._reducedData;
  }
}

module.exports = Reduce;
