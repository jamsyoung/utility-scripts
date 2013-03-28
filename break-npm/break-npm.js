#!/usr/bin/env node
/*jslint node: true */

/*
 * Purpose: This script deletes 40 documents from a couch database then does a
 * publish of a package.  If the publish succeeds it will delete another 40
 * documents.  This will continue until a publish failure, or all the documents
 * are deleted.  This was needed to troublshoot an issue where publishes would
 * fail in a new, empty database, but would work fine in a fully replicated
 * database.
 */


var publishCommand = 'npm --registry http://tnpm.cnn.vgtf.net:5984/registry-backup/_design/scratch/_rewrite --userconfig=/Users/jayoung/.ztnpmrc publish',
    execSync = require('exec-sync'),
    http = require('http'),
    request;


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
            docs = parsedContent.rows,
            execResult,
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
});

