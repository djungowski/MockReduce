var mongoose = require('mongoose');
var mockReduce = require('../../index');

describe('Mongoose Integration', function() {
    it('runs the installer correctly', function() {
        mockReduce.install(mongoose);
		expect(mongoose.model()).toBe(mockReduce);
    });
});