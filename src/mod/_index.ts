// This is where you register all modules! The bot picks up everything listed in here.
// If this file conflicts during an update, feel free to copy this one back over.
// If the update added new modules, you'll have to manually add them. Please make sure
// to read the update notes to make sure you're not missing any required modules!

// Core modules
import Commands from './commands';
import Language from './language';
import Moderation from './moderation';
import Utils from './utils';

// User-imported modules

// Full export:
export default [
    Commands, // load this first! a lot of other modules will depend on it.
    Language, // load after Commands. depends on it!
    Moderation, // load after Language. depends on it!
    Utils,
];
