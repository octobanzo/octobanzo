/* This is where you register all modules! The bot picks up everything listed in here. */

// First, import the modules...
import { default as Commands } from "./commands";
import { default as Language } from "./language";
import { default as Moderation } from "./moderation";
import { default as Utils } from "./utils";

// Then export them all :)
export default [
    Commands, // load this first! a lot of other modules will depend on it.
    Language, // load after Commands. depends on it!
    Moderation, // load after Language. depends on it!
    Utils,
];
