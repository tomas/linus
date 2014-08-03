var exec     = require('child_process').exec,
    memorize = require('memorize'), 
    later    = require('whenever'),
    delayed  = later('getos');

var is_linux = process.platform === 'linux';

var lsb_release = memorize(function(option, cb) {
  console.log('execcing.')
  exec('lsb_release ' + option + ' -s', function(err, stdout) {
    if (err) return cb(err);
    cb(null, stdout.toString().trim());
  });
})

var get_issue = memorize(function(filter_cb, cb) {
  var cmd = 'cat /etc/issue | head -1';
  exec(cmd, function(err, out) {
    if (err) return cb(err);
    cb(null, filter_cb(out.toString()).trim());
  });
})

var get_distro_info = function(what, lsb_param, issue_cb, cb) {
  lsb_release(lsb_param, function(err, name) {
    if (name && name != '')
      return cb(null, name);

    get_issue(issue_cb, function(err, name) {
      if (err || !name)
        return cb(err || new Error("Couldn't get distro " + what + "."));

      cb(null, name);
    })
  })
}

var issue_cbs = {};

issue_cbs.version = function(out) { 
  return out.replace(/[^0-9\.]/g, '') 
};

issue_cbs.name = function(out) { 
  return out.replace(/\d.*/, '')
};

exports.name = function(cb) {
  if (!is_linux)
    return cb(new Error('Not Linux.'));

  get_distro_info('name', '-i', issue_cbs.name, function(err, name) {

    // if it failed, fallback to getos' module strategy.
    if (err || (!name || name == ''))
      return delayed.getos(cb);

    cb(err, name);
  });
};

exports.version = function(cb) {
  if (!is_linux)
    return cb(new Error('Not Linux.'));

  get_distro_info('version', '-r', issue_cbs.version, cb);
};

