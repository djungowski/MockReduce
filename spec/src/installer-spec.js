describe('Install spec', function () {
	beforeEach(function() {
	    this.installer = new MockReduce.Installer();
	});

	it('exists', function() {
		expect(MockReduce.Installer).not.toBeUndefined();
	});

	describe('#install', function() {
	    it('overloads connect of the provided object', function() {
			var mongoDbMock = {
				connect: function() {}
			};
			var originalConnect = mongoDbMock.connect();
			this.installer.install(mongoDbMock);
			expect(mongoDbMock.connect).not.toBe(originalConnect);
	    });
	});
});