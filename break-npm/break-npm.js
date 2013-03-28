#!/usr/bin/env node
/*jslint node: true */

/*
# perl -ne 'if(/(.*)/.*$/){print $1."\n";}'

# get a revision
# curl -s http://tnpm.cnn.vgtf.net:5984/registry-backup/0x23 | cut -f2 -d, | cut -f2 -d: | cut -f2 -d\"

# delete a document
# curl -X DELETE http://admin:ht0401@tnpm.cnn.vgtf.net:5984/registry-backup/0x21?rev=3-0e422a52b4902ef18228b4443d0da70b

# get all doc ids and revision
# curl http://tnpm.cnn.vgtf.net:5984/registry-backup/_all_docs
*/



var sys = require('sys'),
    http = require('http'),
    child,
    request,
    execSync = require('exec-sync'),
    publishCommand = 'npm --registry http://tnpm.cnn.vgtf.net:5984/registry-backup/_design/scratch/_rewrite --userconfig=/Users/jayoung/.ztnpmrc publish';



request = http.get({
    'host': 'tnpm.cnn.vgtf.net',
    'port': 5984,
    'path': '/registry-backup/_all_docs'
}, function (response) {
    'use strict';
    var content = '';

    response.on('data', function (chunk) {
        content += chunk;
    });

    response.on('end', function () {
        var parsedContent = JSON.parse(content),
            execResult,
            success,
            docs = parsedContent.rows,
            key,
            rev,
            i;

        for (i in docs) {
            if (docs.hasOwnProperty(i)) {
                key = docs[i].key;
                rev = docs[i].value.rev;

                if (key !== '_design/app' && key !== '_design/ghost' && key !== '_design/scratch') {
                    console.log('[INFO] Deleting ' + key + '@' + rev);
                    execSync('curl -sX DELETE http://admin:ht0401@tnpm.cnn.vgtf.net:5984/registry-backup/' + key + '?rev=' + rev, true);

                    if ((i % 40) === 0) {
                        console.log('[INFO] Publishing test package');
                        execResult = execSync(publishCommand, true);

                        if (execResult.stdout) {
                            console.log('PUBLISH SUCCESS!');
                            console.log('[INFO] revving version number');
                            execSync('grunt bump');
                        } else {
                            console.log('PUBLISH FAILED!');
                            process.exit();
                        }
                    }
                }
            }
        }
    });
});



request.on('error', function (error) {
    'use strict';
    console.log('error: ' + error.message);
    return false;
});
