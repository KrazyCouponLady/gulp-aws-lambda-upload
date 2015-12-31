var through = require('through2'),
	AWS = require('aws-sdk'),
	gutil = require('gulp-util'),
	_ = require('lodash'),
	PluginError = gutil.PluginError;

module.exports = function(parameters) {
	var PLUGIN_NAME = 'gulp_aws_lambda_upload';

	// The AWS Role ARN cannot be defaulted
	if (typeof parameters == 'undefined' || typeof parameters.role == 'undefined') {
		throw new PluginError(PLUGIN_NAME, 'Missing required parameter: role (must be a valid ARN)');
	}

	if (typeof parameters.region == 'undefined') {
		parameters.region == 'us-west-2';
		gutil.log('Warning! No region specified; using default value of "us-west-2"');
		gutil.beep();
	}	

	// This is so that JS parameter naming conventions can be followed (convenience)
	var upperCaseParameters = {
		FunctionName: parameters.functionName,
		Handler: parameters.handler,
		Timeout: parameters.timeout,
		Description: parameters.description,
		MemorySize: parameters.memorySize 
	};

	function getLambdaName(basePath) {
		if (basePath[basePath.length - 1] == '/') {
			basePath = basePath.substr(0, basePath.length - 1);
		}
		return basePath.substr(basePath.lastIndexOf('/') + 1).replace('.zip', '');
	}

	function read(file, enc, cb) {
		var name = getLambdaName(file.path),
			_parameters = _.merge({
				FunctionName : name,
				Handler : name + '.handler',
				Code : { ZipFile : null },
				Runtime : 'nodejs',
				Description : 'AWS Lambda',
				Timeout : 1,
				MemorySize : 128
			}, upperCaseParameters),
			emitter = this,
			aws = parameters.aws || AWS;

		aws.config.region = parameters.region;
		var lambda = new aws.Lambda();

		lambda.listFunctions({},function(err, listOfFunctions) {
			if (err) {
				emitter.emit('error', err);
				throw new PluginError(PLUGIN_NAME, err, {showStack: true});
			}
			else {
				for (var i = 0, count = listOfFunctions.Functions.length; i < count; i++) {
					if (listOfFunctions.Functions[i].FunctionName !== _parameters.FunctionName) {
						continue;
					}
					lambda.updateFunctionCode({
						'FunctionName' : _parameters.FunctionName, 
						'ZipFile' : file.contents

					}, cb);
					return;
				}

				_parameters.Code.ZipFile = file.contents;
				lambda.createFunction(_parameters, cb);
			}
		});
	}

	function end(cb) {
		this.emit('end');
		cb();
	}

	return through.obj(read, end);
};
