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
			var originalConnect = mongoDbMock.connect;
			this.installer.install(mongoDbMock);
			expect(mongoDbMock.connect).not.toBe(originalConnect);
	    });

		it('overloads connect and createConnection', function() {
			var mongoDbMock = {
				connect: function() {},
				createConnection: function() {}
			};
			var originalConnect = mongoDbMock.connect;
			var originalCreateConnection = mongoDbMock.createConnection;
			this.installer.install(mongoDbMock);
			expect(mongoDbMock.connect).not.toBe(originalConnect);
			expect(mongoDbMock.createConnection).not.toBe(originalCreateConnection);
		});
	});

	describe('#uninstall', function() {
	    it('reinstalls the original connect', function() {
			var mongoDbMock = {
				connect: function() {}
			};
			var originalConnect = mongoDbMock.connect;
			this.installer.install(mongoDbMock);
			this.installer.uninstall();
			expect(mongoDbMock.connect).toBe(originalConnect);
	    });

		it('reinstalls the original connect and createConnection', function() {
			var mongoDbMock = {
				connect: function() {},
				createConnection: function() {}
			};
			var originalConnect = mongoDbMock.connect;
			var originalCreateConnection = mongoDbMock.createConnection;
			this.installer.install(mongoDbMock);
			this.installer.uninstall();
			expect(mongoDbMock.connect).toBe(originalConnect);
			expect(mongoDbMock.createConnection).toBe(originalCreateConnection);
		});
	});
});