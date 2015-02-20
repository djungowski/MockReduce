describe('Scope tests', function() {
    it('exists', function() {
        expect(MockReduce.Scope).not.toBeUndefined();
    });

	beforeEach(function() {
	   this.scope = new MockReduce.Scope();
	});

	describe('#expose', function () {
		it('exposes all given variables', function() {
		    var scopeVars = {
				stringVar: "var",
				functionVar: function () {
					return false;
				},
				objectVar: {
					name: "Clyde Martin"
				}
			};

			this.scope.expose(scopeVars);
			expect(window.stringVar).toBe(scopeVars.stringVar);
			expect(window.functionVar).toBe(scopeVars.functionVar);
			expect(window.objectVar).toBe(scopeVars.objectVar);

			delete window.stringVar;
			delete window.functionVar;
			delete window.objectVar;
		});
	});
});