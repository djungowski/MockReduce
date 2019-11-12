const Installer = require("../../src/installer");

describe("Install spec", function() {
  beforeEach(function() {
    this.installer = new Installer();
    this.mockReduceMock = {
      mapReduce: function() {}
    };
	});
	
	afterEach(function() {
		this.installer.uninstall();
	});

  describe("#install", function() {
    describe(".connect", function() {
      it("overloads connect of the provided object", function() {
        var mongoDbMock = {
          connect: function() {}
        };
        var originalConnect = mongoDbMock.connect;
        this.installer.install(mongoDbMock, this.mockReduceMock);
        expect(mongoDbMock.connect).not.toBe(originalConnect);
      });

      it("overloads connect and createConnection", function() {
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

      it("returns an object with a .collection method which itself returns mockReduce", function() {
        var mongoDbMock = {
          connect: function() {}
        };
        this.installer.install(mongoDbMock, this.mockReduceMock);
        var actualDb = null;
        var expectedDb = {
          collection: jasmine.any(Function)
        };
        mongoDbMock.connect("foo", function(err, db) {
          actualDb = db;
        });
        expect(actualDb).toEqual(expectedDb);
        expect(actualDb.collection()).toBe(this.mockReduceMock);
      });

      it("does not break if connect is not given a callback", function() {
        var mongoDbMock = {
          connect: function() {}
        };
        this.installer.install(mongoDbMock, this.mockReduceMock);

        var openConnection = function() {
          mongoDbMock.connect("foo");
        };
        expect(openConnection).not.toThrow();
      });

      it("does not overload connect when running install twice before using uninstall", function() {
        var mongoDbMock = {
          connect: function() {}
        };
        var originalConnect = mongoDbMock.connect;
        this.installer.install(mongoDbMock, this.mockReduceMock);
        this.installer.install(mongoDbMock, this.mockReduceMock);
        this.installer.uninstall();
        expect(mongoDbMock.connect).toBe(originalConnect);
      });

      it("does overload if install is run twice with uninstall inbetween", function() {
        var mongoDbMock = {
          connect: function() {}
        };
        var originalConnect = mongoDbMock.connect;
        this.installer.install(mongoDbMock, this.mockReduceMock);
        this.installer.uninstall();
        expect(mongoDbMock.connect).toBe(originalConnect);
        this.installer.install(mongoDbMock, this.mockReduceMock);
        expect(mongoDbMock.connect).not.toBe(originalConnect);
      });
    });

    describe(".model", function() {
      beforeEach(function() {
        this.mongooseMock = {
          connect: function() {},
          model: function() {}
        };
      });

      it("overloads model", function() {
        var originalModel = this.mongooseMock.model;
        this.installer.install(this.mongooseMock, this.mockReduceMock);
        expect(this.mongooseMock.model).not.toBe(originalModel);
      });

      it("does not set .model if .model is not present", function() {
        var mongoDbMock = {
          connect: function() {}
        };
        this.installer.install(mongoDbMock, this.mockReduceMock);
        expect(mongoDbMock.model).toBeUndefined();
      });

      it("enriches the model when calling .model", function() {
        var model = {
          paths: {}
        };
        spyOn(this.mongooseMock, "model").and.returnValue(model);

        var expectedModel = {
          paths: {},
          mapReduce: jasmine.any(Function)
        };

        this.installer.install(this.mongooseMock, this.mockReduceMock);
        expect(this.mongooseMock.model()).toEqual(expectedModel);
      });

      it("calls the original method when calling .model", function() {
        spyOn(this.mongooseMock, "model").and.returnValue({});
        var originalModel = this.mongooseMock.model;

        this.installer.install(this.mongooseMock, this.mockReduceMock);
        this.mongooseMock.model("Schema_Name", {}, "Collection_Name", false);

        expect(originalModel).toHaveBeenCalledWith(
          "Schema_Name",
          {},
          "Collection_Name",
          false
        );
      });

      it("calls mapReduce with the correct arguments and returns its value", function() {
        spyOn(this.mongooseMock, "model").and.returnValue({});
        spyOn(this.mockReduceMock, "mapReduce").and.returnValue("some string");
        this.installer.install(this.mongooseMock, this.mockReduceMock);
        var model = this.mongooseMock.model(
          "Schema_Name",
          {},
          "Collection_Name",
          false
        );
        var mapReduce = {
          map: function() {},
          reduce: function() {}
        };
        var result = model.mapReduce(mapReduce);
        expect(this.mockReduceMock.mapReduce).toHaveBeenCalledWith(mapReduce);
        expect(result).toEqual("some string");
      });
    });
  });

  describe("#uninstall", function() {
    it("reinstalls the original connect", function() {
      var mongoDbMock = {
        connect: function() {}
      };
      var originalConnect = mongoDbMock.connect;
      this.installer.install(mongoDbMock, this.mockReduceMock);
      this.installer.uninstall();
      expect(mongoDbMock.connect).toBe(originalConnect);
    });

    it("reinstalls the original connect and createConnection", function() {
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

    it("does not set createConnection to null if it is not defined", function() {
      var mongoDbMock = {
        connect: function() {}
      };
      this.installer.install(mongoDbMock, this.mockReduceMock);
      this.installer.uninstall();
      expect(mongoDbMock.createConnection).toBeUndefined();
    });

    it("reinstalls the original model", function() {
      var mongooseMock = {
        connect: function() {},
        model: function() {}
      };
      var originalModel = mongooseMock.model;
      this.installer.install(mongooseMock, this.mockReduceMock);
      this.installer.uninstall();
      expect(mongooseMock.model).toBe(originalModel);
    });

    it("does not set model to null if it is not defined", function() {
      var mongoDbMock = {
        connect: function() {}
      };
      this.installer.install(mongoDbMock, this.mockReduceMock);
      this.installer.uninstall();
      expect(mongoDbMock.model).toBeUndefined();
    });
  });
});
