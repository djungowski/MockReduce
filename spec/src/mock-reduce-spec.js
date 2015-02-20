describe('Mock Reduce Test', function() {
    it('exists', function() {
        expect(MockReduce).not.toBeUndefined();
    });

	beforeEach(function() {
		this.mapMock = {
			run: function() {}
		};

		this.reduceMock = {
			run: function() {}
		};

		this.scopeMock = {
			expose: function() {},
			concealAll: function() {}
		};

	    this.mockReduce = new MockReduce(this.mapMock, this.reduceMock, this.scopeMock);
	});

	describe('#run', function() {
		var mockData = [
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"},
			{claptrap: "data"}
		];

		var mappedData = [
			{"_id": 42, "value": [1337, 2, 4, 6, 77]},
			{"_id": 1337, "value": [0, 0, 1, 2]}
		];

		var reducedData = [
			{"_id": 42, "value": "A Flight to Remember"},
			{"_id": 1337, "value": "A Tale of Two Santas"}
		];

		var finalizedData = [
			{"_id": 42, "value": "Mars University"},
			{"_id": 1337, "value": "Bendin' in the Wind"}
		];

	    it('calls map and reduce with the correct data and returns the correct data', function() {
			var mapReduce = {
				map: function() {},
				reduce: function() {}
			};
			spyOn(this.mapMock, 'run').and.returnValue(mappedData);
			spyOn(this.reduceMock, 'run').and.returnValue(reducedData);

			this.mockReduce.setNextTestData(mockData);
			var actual = this.mockReduce.run(mapReduce);
			expect(this.mapMock.run).toHaveBeenCalledWith(mockData, mapReduce.map);
			expect(this.reduceMock.run).toHaveBeenCalledWith(mappedData, mapReduce.reduce);
			expect(actual).toEqual(reducedData);
	    });

		it('calls map, reduce and finalize with the correct data and returns the correct data', function () {
			var mapReduce = {
				map: function() {},
				reduce: function() {},
				finalize: function() {}
			};
			var me = this;
			spyOn(this.mapMock, 'run').and.returnValue(mappedData);
			spyOn(this.reduceMock, 'run').and.callFake(function () {
				if (me.reduceMock.run.calls.count() == 1) {
					return reducedData;
				}
				return finalizedData;
			});

			this.mockReduce.setNextTestData(mockData);
			var actual = this.mockReduce.run(mapReduce);
			expect(this.mapMock.run).toHaveBeenCalledWith(mockData, mapReduce.map);
			expect(this.reduceMock.run.calls.argsFor(0)).toEqual([mappedData, mapReduce.reduce]);
			expect(this.reduceMock.run.calls.argsFor(1)).toEqual([reducedData, mapReduce.finalize]);
			expect(this.reduceMock.run.calls.count()).toEqual(2);
			expect(actual).toEqual(finalizedData);
		});

		it('only uses the test data once, returns empty array if no testData is provided', function() {
			var mapReduce = {
				map: function() {},
				reduce: function() {}
			};
			spyOn(this.mapMock, 'run');
			spyOn(this.reduceMock, 'run');

			var mockData = [
				{first: "data"}
			];

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce);
			expect(this.mapMock.run.calls.count()).toEqual(1);
			expect(this.reduceMock.run.calls.count()).toEqual(1);

			this.mapMock.run.calls.reset();
			this.reduceMock.run.calls.reset();

			var actual = this.mockReduce.run(mapReduce);
			expect(this.mapMock.run.calls.count()).toEqual(0);
			expect(this.reduceMock.run.calls.count()).toEqual(0);
			expect(actual).toEqual([]);
		});

		it('exposes and conceals all given scope variables', function() {
			var mapReduce = {
				scope: {
					value: "does not matter"
				},
				map: function() {},
				reduce: function() {}
			};

			spyOn(this.scopeMock, 'expose');
			spyOn(this.scopeMock, 'concealAll');

			var mockData = [
				{first: "data"}
			];

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce);
			expect(this.scopeMock.expose).toHaveBeenCalledWith(mapReduce.scope);
			expect(this.scopeMock.concealAll).toHaveBeenCalled();
		});

		it('calls the callback with the final data if defined', function() {
		    var mapReduce = {
				map: function () {},
				reduce: function() {}
			};
			var callbackSpy = {
				run: function() {}
			};
			spyOn(this.reduceMock, 'run').and.returnValue(reducedData);
			spyOn(callbackSpy, 'run');
			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.run(mapReduce, callbackSpy.run);
			expect(callbackSpy.run).toHaveBeenCalledWith(null, reducedData);
		});
	});

	describe('#mapReduce', function () {
		var mockData = [{}];

		var mapReduce = {
			map: function() {},
			reduce: function() {},
			finalize: function() {}
		};

		it('calls all the mocks since it simply wraps run when providing a mapReduce object', function() {
			spyOn(this.mapMock, 'run');
			spyOn(this.reduceMock, 'run');

			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.mapReduce(mapReduce);
			expect(this.mapMock.run).toHaveBeenCalled();
			// finalize also calls reduce.run
			expect(this.reduceMock.run.calls.count()).toEqual(2);
		});

		it('calls the callback', function () {
			var callbackSpy = {
				run: function() {}
			};
			spyOn(callbackSpy, 'run');
			this.mockReduce.setNextTestData(mockData);
			this.mockReduce.mapReduce(mapReduce, callbackSpy.run);
			expect(callbackSpy.run).toHaveBeenCalled();
		});
	});

	describe('#init', function() {
	    it('creates a scope object with map, mock and scope instances', function() {
	        var map = new MockReduce.Map(new MockReduce.Scope());
	        var reduce = new MockReduce.Reduce();
	        var scope = new MockReduce.Scope();

			var mockReduce = MockReduce.init();
			expect(mockReduce._map).toEqual(map);
			expect(mockReduce._reduce).toEqual(reduce);
			expect(mockReduce._scope).toEqual(scope);
	    });
	});

	describe('#install', function() {
		it('throws an exception if no installer is set', function() {
			var me = this;
			var spec = function() {
				this.mockReduce.install();
			};
			expect(spec).toThrow();
		});

		it('calls the installer#install if present', function () {
			var installerMock = {
				install: function() {}
			};
			var connectorMock = {
				connect: function() {}
			};
			spyOn(installerMock, 'install');
			this.mockReduce.setInstaller(installerMock);
			this.mockReduce.install(connectorMock);
			expect(installerMock.install).toHaveBeenCalledWith(connectorMock, this.mockReduce);
		})
	});

	describe('#uninstall', function() {
		it('throws an exception if no installer is set', function() {
			var me = this;
			var spec = function() {
				this.mockReduce.uninstall();
			};
			expect(spec).toThrow();
		});

		it('calls the installer#uninstall if present', function () {
			var installerMock = {
				uninstall: function() {}
			};
			var connectorMock = {
				connect: function() {}
			};
			spyOn(installerMock, 'uninstall');
			this.mockReduce.setInstaller(installerMock);
			this.mockReduce.uninstall(connectorMock);
			expect(installerMock.uninstall).toHaveBeenCalled();
		})
	});
});