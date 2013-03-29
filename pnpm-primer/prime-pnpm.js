#!/usr/bin/env node
/*jslint node: true */

/*
 * Purpose: Prime a private npm repository with a bunch of packages
 */


var execSync = require('exec-sync'),
    targetHost = "admin:turner@npm.cnn.vgtf.net:5984/_replicate",
    result,
    json = {
        source: "http://isaacs.iriscouch.com/registry/",
        target: "registry",
        create_target: true,
        doc_ids: [
            "async",
            "aws-sign",
            "boom",
            "buffer-crc32",
            "bytes",
            "check-types",
            "colors",
            "combined-stream",
            "commander",
            "complexity-report",
            "connect",
            "consolidate",
            "cookie",
            "cookie-jar",
            "cookie-signature",
            "cradle",
            "cryptiles",
            "debug",
            "delayed-stream",
            "dust-compiler",
            "dustjs-helpers",
            "dustjs-linkedin",
            "express",
            "follow",
            "forever-agent",
            "form-data",
            "formidable",
            "fresh",
            "growl",
            "hawk",
            "hoek",
            "jade",
            "json-stringify-safe",
            "methods",
            "mime",
            "mkdirp",
            "mocha",
            "ms",
            "node-uuid",
            "nodemon",
            "oauth-sign",
            "pause",
            "qs",
            "range-parser",
            "request",
            "send",
            "sntp",
            "tunnel-agent",
            "vargs",
            "watch",
            "wrench",
            "xunit-file",
            "yuicompressor"
        ]
    },
    curlCommand = "curl -sH 'Content-Type: application/json' -X POST 'http://" + targetHost + "' -d '" + JSON.stringify(json) + "'";

console.log(curlCommand);

result = execSync(curlCommand);

console.log(result);
