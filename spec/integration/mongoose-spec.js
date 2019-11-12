var requireUncached = require('../helpers/require-uncached');
var mongoose = require("mongoose");
var mockReduce = requireUncached("../../index");

describe("Mongoose Integration", function() {
  beforeEach(() => {
    mockReduce.install(mongoose);
  });

  afterEach(() => {
    mockReduce.uninstall();
  });

  it("runs the installer correctly", function() {
    spyOn(mockReduce, "mapReduce");

    var model = mongoose.model("Some Name", {});
    model.mapReduce();
    expect(mockReduce.mapReduce).toHaveBeenCalled();
  });

  describe("MapReduce", function() {
    var testData = [
      { someId: 42, someString: "Chickens don't clap!", value: 4 },
      { someId: 5, someString: "I'm on the job.", value: 5 },
      { someId: 42, someString: "Annyong", value: 8 },
      {
        someId: 5,
        someString: "Come on, this is a Bluth family celebration.",
        value: 5
      }
    ];

    var emits = [
      { _id: 42, value: 4 },
      { _id: 5, value: 5 },
      { _id: 42, value: 8 },
      { _id: 5, value: 5 }
    ];

    var mappedData = [{ _id: 5, value: [5, 5] }, { _id: 42, value: [4, 8] }];

    var reducedData = [{ _id: 5, value: 10 }, { _id: 42, value: 12 }];

    it("runs mockReduce in a mongoose schema", function() {
      var schema = mongoose.Schema({
        someId: Number,
        someString: String
      });

      schema.statics.someMethodThatCallsMapReduce = function() {
        var mapReduce = {
          map: function() {
            emit(this.someId, this.value);
          },
          reduce: function(key, values) {
            return values.reduce(function(prev, current) {
              return (prev || 0) + current;
            });
          }
        };

        return model.mapReduce(mapReduce);
      };

      mockReduce.setNextTestData(testData);
      var model = mongoose.model("Collection_Name", schema);
      var result = model.someMethodThatCallsMapReduce();
      expect(mockReduce.map.getEmits()).toEqual(emits);
      expect(mockReduce.map.getMappedData()).toEqual(mappedData);
      expect(mockReduce.reduce.getReducedData()).toEqual(reducedData);
      expect(result).toEqual(reducedData);
    });
  });
});
