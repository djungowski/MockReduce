describe('Scope tests', function() {
    it('exists', function() {
        expect(MockReduce.Scope).not.toBeUndefined();
    });

	beforeEach(function() {
	   this.scope = new MockReduce.Scope();
	});

	var scopeVars = {
		stringVar: "var",
		functionVar: function () {
			return false;
		},
		objectVar: {
			name: "Clyde Martin"
		}
	};

	describe('#expose', function () {
		it('exposes all given variables', function() {
			this.scope.expose(scopeVars);
			expect(window.stringVar).toBe(scopeVars.stringVar);
			expect(window.functionVar).toBe(scopeVars.functionVar);
			expect(window.objectVar).toBe(scopeVars.objectVar);

			delete window.stringVar;
			delete window.functionVar;
			delete window.objectVar;
		});
	});

	describe('#concealAll', function () {
		it('conceals all previously exposed variables', function () {
			this.scope.expose(scopeVars);
			this.scope.concealAll();
			expect(window.stringVar).toBeUndefined();
			expect(window.functionVar).toBeUndefined();
			expect(window.objectVar).toBeUndefined();
		});

		it('only conceals the given vars when run and concealed more than once', function () {
			this.scope.expose(scopeVars);
			this.scope.concealAll();
			this.scope.expose({
				foo: "bar"
			});
			expect(window.foo).toEqual('bar');
			expect(window.stringVar).toBeUndefined();
			expect(window.functionVar).toBeUndefined();
			expect(window.objectVar).toBeUndefined();
			this.scope.concealAll();
			expect(window.stringVar).toBeUndefined();
			expect(window.functionVar).toBeUndefined();
			expect(window.objectVar).toBeUndefined();
			expect(window.foo).toBeUndefined();
		});

		it('does not null or undefine the original passed variables object', function () {
			this.scope.expose(scopeVars);
			this.scope.concealAll();
			expect(scopeVars).not.toBeNull();
			expect(scopeVars).not.toBeUndefined();
		});
	});
});