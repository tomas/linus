Linus
=====

Get current's distribution name and version. Like a boss. Like Linus.

Example
-------

     var distro = require('linus');

     distro.name(function(err, name) {
       if (name)
         console.log('Current distro: ' + name);
       else
         console.log(err.message || 'Failed.');
     })

     distro.version(function(err, version) {
       if (version)
         console.log('Version is: ' + version);
       else
         console.log(err.message || 'Failed.');
     })

That't about it.

Tiny print
----------

Written by Tomás Pollak. 
(c) Fork, Ltd. MIT Licensed.
