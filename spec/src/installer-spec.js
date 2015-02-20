describe('Install spec', function () {
	beforeEach(function() {
	    this.installer = new MockReduce.Installer();
		this.mockReduceMock = {};
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
			this.installer.install(mongoDbMock, this.mockReduceMock);
			expect(mongoDbMock.connect).not.toBe(originalConnect);
	    });

		it('overloads connect and createConnection', function() {
			var mongoDbMock = {
				connect: function() {},
				createConnection: function() {}
			};
			var originalConnect = mongoDbMock.connect;
			var originalCreateConnection = mongoDbMock.createConnection;
			this.installer.install(mongoDbMock, this.mockReduceMock);
			expect(mongoDbMock.connect).not.toBe(originalConnect);
			expect(mongoDbMock.createConnection).not.toBe(originalCreateConnection);
		});

		it('overloads model', function() {
		    var mongooseMock = {
				connect: function() {},
				model: function() {}
			};

			var originalModel = mongooseMock.model;
			this.installer.install(mongooseMock, this.mockReduceMock);
			expect(mongooseMock.model).not.toBe(originalModel);
		});

		it('does not set .model if .model is not present', function () {
			var mongoDbMock = {
				connect: function() {}
			};
			var originalConnect = mongoDbMock.connect;
			this.installer.install(mongoDbMock, this.mockReduceMock);
			expect(mongoDbMock.model).toBeUndefined();
		});
	});

	describe('#uninstall', function() {
	    it('reinstalls the original connect', function() {
			var mongoDbMock = {
				connect: function() {}
			};
			var originalConnect = mongoDbMock.connect;
			this.installer.install(mongoDbMock, this.mockReduceMock);
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
			this.installer.install(mongoDbMock, this.mockReduceMock);
			this.installer.uninstall();
			expect(mongoDbMock.connect).toBe(originalConnect);
			expect(mongoDbMock.createConnection).toBe(originalCreateConnection);
		});

		it('does not set createConnection to null if it is not defined', function() {
			var mongoDbMock = {
				connect: function() {}
			};
			this.installer.install(mongoDbMock, this.mockReduceMock);
			this.installer.uninstall();
			expect(mongoDbMock.createConnection).toBeUndefined();
		});
	});
});