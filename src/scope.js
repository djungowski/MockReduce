class Scope {
  /**
   * @constructor
   *
   * @param scope
   */
  constructor(scope) {
    /**
     * The scope to expose and conceal variables in
     * Most likely will be window or global
     *
     * @var {object}
     *
     */
    this._scope = scope;

    /**
     * The variables that have been exposed last
     *
     * @type {Object}
     * @private
     */
    this._lastExposedVariables = null;
  }

  /**
   * Basically check if we're in browser or node context
   * 
   * @returns {window|global|Object}
   */
  static getGlobalScope() {
    let globalScope;
    if (typeof window !== "undefined") {
      globalScope = window;
    } else if (typeof global !== "undefined") {
      globalScope = global;
    } else {
      globalScope = {};
    }

    return globalScope;
  }

  /**
   * Expose all provided variables
   *
   * @param variables "{firstkey: 'firstvalue', secondkey: 'secondvalue'}"
   */
  expose(variables) {
    for (var key in variables) {
      if (!variables.hasOwnProperty(key)) {
        continue;
      }

      this._scope[key] = variables[key];
    }
    this._lastExposedVariables = variables;
  }

  /**
   * Conceal all variables that have been exposed last
   *
   */
  concealAll() {
    for (var key in this._lastExposedVariables) {
      if (!this._lastExposedVariables.hasOwnProperty(key)) {
        continue;
      }
      delete this._scope[key];
    }

    this._lastExposedVariables = null;
  }
}

module.exports = Scope;
