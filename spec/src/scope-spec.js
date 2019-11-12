const Scope = require('../../src/scope');

describe('Scope tests', function() {
	beforeEach(function() {
		this.scopeMock = {};
		this.scope = new Scope(this.scopeMock);
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
			expect(this.scopeMock.stringVar).toBe(scopeVars.stringVar);
			expect(this.scopeMock.functionVar).toBe(scopeVars.functionVar);
			expect(this.scopeMock.objectVar).toBe(scopeVars.objectVar);

			delete this.scopeMock.stringVar;
			delete this.scopeMock.functionVar;
			delete this.scopeMock.objectVar;
		});
	});

	describe('#concealAll', function () {
		it('conceals all previously exposed variables', function () {
			this.scope.expose(scopeVars);
			this.scope.concealAll();
			expect(this.scopeMock.stringVar).toBeUndefined();
			expect(this.scopeMock.functionVar).toBeUndefined();
			expect(this.scopeMock.objectVar).toBeUndefined();
		});

		it('only conceals the given vars when run and concealed more than once', function () {
			this.scope.expose(scopeVars);
			this.scope.concealAll();
			this.scope.expose({
				foo: "bar"
			});
			expect(this.scopeMock.foo).toEqual('bar');
			expect(this.scopeMock.stringVar).toBeUndefined();
			expect(this.scopeMock.functionVar).toBeUndefined();
			expect(this.scopeMock.objectVar).toBeUndefined();
			this.scope.concealAll();
			expect(this.scopeMock.stringVar).toBeUndefined();
			expect(this.scopeMock.functionVar).toBeUndefined();
			expect(this.scopeMock.objectVar).toBeUndefined();
			expect(this.scopeMock.foo).toBeUndefined();
		});

		it('does not null or undefine the original passed variables object', function () {
			this.scope.expose(scopeVars);
			this.scope.concealAll();
			expect(scopeVars).not.toBeNull();
			expect(scopeVars).not.toBeUndefined();
		});
	});
});