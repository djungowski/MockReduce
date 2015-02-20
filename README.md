# MockReduce
A mock for mongodbs/mongoose's mapReduce in order to achieve testability

## Installation

```bash
npm install mock-reduce
```

## Using MockReduce with mongoose
```javascript
var mongoose = require('mongoose');
var mockReduce = require('mock-reduce');

describe('Mongoose Test', function() {
	it('runs a mock reduce and returns the expected data', function() {
		var testData = [
			{"someId": 42, "someString": "Chickens don't clap!", "value": 4},
			{"someId": 5, "someString": "I'm on the job.", "value": 5},
			{"someId": 42, "someString": "Annyong", "value": 8},
			{"someId": 5, "someString": "Come on, this is a Bluth family celebration.", "value": 5}
		];
		
		var reducedData = [
			{"_id": 5, value: 10},
			{"_id": 42, value: 12}
		];
		
		mockReduce.install(mongoose);
		mockReduce.setNextTestData(testData);
		var model = require('./models/myModel');
		var result = model.someMethodThatCallsMapReduce();
		expect(result).toEqual(reducedData);
		mockReduce.uninstall();
	});
});
```
