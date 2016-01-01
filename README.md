## Intro

A Gulp plugin that will upload, or update existing, AWS Lambda modules that have been zipped. 

## Installation

Install package with NPM, and add it to your development dependencies:

```npm install --save-dev gulp-aws-lambda-upload```

## Important

The AWS SDK must be set up correctly on the machine for this plugin to work:  https://aws.amazon.com/sdk-for-node-js/.

## Usage
A sample workflow:

```
+-- gulpfile.js
+-- build
|   +-- MyLambda.zip
+-- src
|   +-- MyLambda
|       +-- MyLambda.js
|       +-- event.json
```

The following task could be used to execute a module in the above workflow (the Role ARN is obscured and needs to be set to a real ARN for this code to work).  Tasks for 'clean', 'install' and 'zip' are left to the implementers discretion--the example output shows the order that it could happen in a build server workflow. 

```
var gulp = require('gulp'),
    path = require('path'),
    runner = require('gulp-aws-lambda-upload');

gulp.task('upload', ['zip'], function() {

	return gulp.src(path.join(__dirname, 'build/*.zip'))
			.pipe(upload({
					role: 'arn:aws:iam::<account-id>:role/lambda_basic_execution',
					region: 'us-west-2',
					timeout: 10
			}));
});
```

### Example Output

```
$ gulp upload
[08:15:52] Using gulpfile /path/to/gulpfile.js
[08:15:52] Starting 'clean'...
[08:15:52] Finished 'clean' after 7.2 ms
[08:15:52] Starting 'install'...
[08:15:53] Finished 'install' after 622 ms
[08:15:53] Starting 'zip'...
[08:15:54] Finished 'zip' after 1.06 s
[08:15:54] Starting 'upload'...
[08:15:54] Sending...
{ FunctionName: 'MyLambda',
  Handler: 'MyLambda.handler',
  Code: { ZipFile: null },
  Runtime: 'nodejs',
  Description: 'AWS Lambda',
  Timeout: 10,
  MemorySize: 128,
  Role: 'arn:aws:iam::<account-id>:role/lambda_basic_execution' }
[08:16:11] Finished 'upload' after 9 s
```

The MIT License (MIT)

Copyright (c) 2015 The Krazy Coupon Lady

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


