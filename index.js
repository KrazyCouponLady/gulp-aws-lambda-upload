var through = require('through2'),
    AWS = require('aws-sdk'),
    gutil = require('gulp-util'),
    _ = require('lodash'),
    util = require('util'),
    PluginError = gutil.PluginError;

module.exports = function (parameters) {
    var PLUGIN_NAME = 'gulp_aws_lambda_upload';

    if (typeof parameters != 'object') {
        throw new PluginError(PLUGIN_NAME, 'Missing required parameters (object)');
    }

    if (typeof parameters.role == 'undefined') {
        throw new PluginError(PLUGIN_NAME, 'Missing required parameter: role (must be a valid ARN)');
    }

    if (typeof parameters.region == 'undefined') {
        throw new PluginError(PLUGIN_NAME, 'Missing required parameter: region');
    }

    // This is so that JS parameter naming conventions can be followed (convenience)
    var upperCaseParameters = {
        FunctionName: parameters.functionName,
        Handler: parameters.handler,
        Timeout: parameters.timeout,
        Description: parameters.description,
        MemorySize: parameters.memorySize,
        Role: parameters.role
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
                FunctionName: name,
                Handler: name + '.handler',
                Code: {ZipFile: null},
                Runtime: 'nodejs',
                Description: 'AWS Lambda',
                Timeout: 1,
                MemorySize: 128
            }, upperCaseParameters),
            emitter = this,
            aws = parameters.aws || AWS;

        aws.config.region = parameters.region;
        var lambda = new aws.Lambda();

        lambda.listVersionsByFunction({FunctionName: _parameters.FunctionName, MaxItems: 1}, function (err) {
            if (err) {
                if (err.statusCode === 404) {
                    gutil.log('Sending...\n', gutil.colors.gray(util.inspect(_parameters)));
                    _parameters.Code.ZipFile = file.contents;
                    lambda.createFunction(_parameters, cb);
                } else {
                    emitter.emit('error', err);
                    throw new PluginError(PLUGIN_NAME, err, {showStack: true});
                }
            } else {
                gutil.log('Updating...\n', gutil.colors.gray(util.inspect(_parameters)));
                lambda.updateFunctionCode({
                    'FunctionName': _parameters.FunctionName,
                    'ZipFile': file.contents
                }, cb);
            }
        });
    }

    function end(cb) {
        this.emit('end');
        gutil.beep();
        cb();
    }

    return through.obj(read, end);
};

