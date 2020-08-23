const path = require('path');
const fs = require('fs');

console.log('Starting Octobanzo...');

fs.exists(path.join(__dirname, 'bin', 'index.js'), (exists) => {
    if (!exists)
        return console.error('Run file not found. Have you run "yarn build" yet?');

    const { run } = require('./bin/index');
    run();
});
