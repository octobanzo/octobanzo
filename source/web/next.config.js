const NEXT = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
    const config = { ...defaultConfig };

    // netlify build
    if (phase === NEXT.PHASE_PRODUCTION_BUILD) config.target = 'serverless';

    return config;
};
