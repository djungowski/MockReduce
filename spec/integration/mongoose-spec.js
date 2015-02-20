var mongoose = require('mongoose');
var mockReduce = require('../../index');

describe('Mongoose Integration', function() {
    it('runs the installer correctly', function() {
		spyOn(mockReduce, 'mapReduce');

        mockReduce.install(mongoose);
		var model = mongoose.model('Some Name', {});
		model.mapReduce();
		expect(mockReduce.mapReduce).toHaveBeenCalled();

		mockReduce.uninstall();
    });

	describe('MapReduce', function () {
		var testData = [
			{"someId": 42, "someString": "Chickens don't clap!", "value": 4},
			{"someId": 5, "someString": "I'm on the job.", "value": 5},
			{"someId": 42, "someString": "Annyong", "value": 8},
			{"someId": 5, "someString": "Come on, this is a Bluth family celebration.", "value": 5}
		];

		var emits = [
			{"someId": 42, "value": 4},
			{"someId": 5, "value": 5},
			{"someId": 42, "value": 8},
			{"someId": 5, "value": 5}
		];

		it('runs mockReduce in a mongoose schema', function() {
			mockReduce.install(mongoose);

			var schema = mongoose.Schema({
				someId: Number,
				someString: String
			});

			schema.statics.someMethodThatCallsMapReduce = function() {
				var mapReduce = {
					map: function () {
						emit(this.someId, this.value);
					}
				};

				model.mapReduce(mapReduce);
			};

			var model = mongoose.model('Collection_Name', schema);

			model.someMethodThatCallsMapReduce();

			mockReduce.uninstall();
		});
	});
});