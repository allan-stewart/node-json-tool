exports.readStream = function (stream, callback) {
  var data = '';
  stream.setEncoding('utf8');
  stream.on('data', function (chunk) {
    data += chunk;
  });
  stream.on('end', function () {
    callback(null, data);
  });
  stream.resume();
}
