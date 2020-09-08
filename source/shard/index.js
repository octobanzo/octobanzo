#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const package = require('./package.json');

console.log('Starting Octobanzo...');

fs.exists(path.join(__dirname, 'bin', 'index.js'), (exists) => {
    if (!exists) {
        let repoUrl = package?.repository?.url;
        if (repoUrl.endsWith('.git')) repoUrl = repoUrl.slice(0, -4);

        return console.error(
            'Run file not found. Please run "yarn build".\n',
            'If running "yarn build" does not work for you,\n',
            'please create an issue on GitHub:\n',
            `${repoUrl ? repoUrl + '/issues' : '[missing GitHub URL]'}`
        );
    }

    const { run } = require('./bin/index');
    run();
});
