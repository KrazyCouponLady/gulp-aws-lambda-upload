var through = require('through2'),
	AWS = require('aws-sdk'),
	gutil = require('gulp-util'),
	_ = require('lodash'),
	PluginError = gutil.PluginError;

module.exports = function(parameters) {

	// The AWS Role ARN cannot be defaulted
	if (typeof parameters == 'undefined' || typeof parameters.role == 'undefined') {
		throw new PluginError('Missing required parameter: role (must be a valid ARN)');
	}

	if (typeof parameters.region == 'undefined') {
		parameters.region == 'us-west-2';
		gutil.log('Warning! No region specified; using default value of "us-west-2"');
		gutil.beep();
	}	

	// This is so that JS parameter conventions can be followed (convenience)
	var upperCaseParameters = {
		FunctionName: parameters.functionName,
		Handler : parameters.handler,
		Timeout : parameters.timeout,
		MemorySize : parameters.memorySize 
	};

	parameters = upperCaseParameters;

	var PLUGIN_NAME = 'gulp_aws_lambda_upload';

	function uploadToAWS(parameters, content, cb) {
		AWS.config.region = parameters.region;
		var lambda = new AWS.Lambda();

		lambda.listFunctions({},function(err, listOfFunctions) {
			if (err) {
				handler.emit('error', err);
				throw new PluginError(PLUGIN_NAME, err, {showStack: true});
			}
			else {
				for (var i = 0, count = listOfFunctions.Functions.length; i < count; i++) {
					if (listOfFunctions.Functions[i].FunctionName !== parameters.FunctionName) {
						continue;
					}
					lambda.updateFunctionCode({
						'FunctionName' : parameters.FunctionName, 
						'ZipFile' : content

					}, cb);
					return;
				}

				parameters.Code.ZipFile = content;
				lambda.createFunction(parameters, cb);
			}
		});
	}

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
			}, parameters);

		uploadToAWS(_parameters, file.contents, cb);
	}

	function end(cb) {
		this.emit('end');
		cb();
	}

	return through.obj(read, end);
};
