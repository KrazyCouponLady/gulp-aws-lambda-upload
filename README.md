## Intro

A Gulp plugin that will upload, or update existing, AWS Lambda modules that have been zipped. 

## Installation

Install package with NPM, and add it to your development dependencies:

```npm install --save-dev gulp-aws-lambda-upload```

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


