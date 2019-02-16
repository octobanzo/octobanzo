import * as config from "config";
import { Client } from "discord.js";
import { isArray } from "util";

export class ModuleManager {
    /** All loaded modules. */
    public modules: Module[] = [];
    /** All handlers presented by modules to be registered. */
    private handlers: Record<string, Array<(...args: any[]) => any>> = {};

    /**
     * Initialize the module manager, primarily adding event handlers.
     * @param client The Discord.js client to handle with.
     */
    public init(client: Client) {
        for (const module of this.modules) {
            if (module.Handlers) {
                for (const eventName in module.Handlers) {
                    // if an array for this event doesn't exist, create one before trying to push
                    if (!this.handlers[eventName]) { this.handlers[eventName] = []; }
                    for (const handler of module.Handlers[eventName]) {
                        this.handlers[eventName].push(handler.bind(module));
                    }
                }
            }
        }

        for (const event in this.handlers) {
            for (const func of this.handlers[event] || []) {
                client.on(event, func);
            }
        }
    }

    /**
     * Add a new module.
     * @param module The module to be added
     */
    public add(...module: Module[]) {
        for (const mod of module) {
            if (mod.Enabled) {
                this.modules.push(mod);
            } else {
                return;
            }
        }

        return this;
    }
}

export interface IModuleOptions {
    /**
     * Module name.
     */
    name: string;
    /**
     * Module version. Preferred format is major-minor-tiny (e.g. 1.2.3).
     */
    version: string;
    /**
     * A brief description of the module.
     */
    description?: string;
    /**
     * Settings required to enable module. Only `boolean` values.
     */
    requiredSettings?: string | string[];
}

export class Module {
    /** Module name. */
    public Name: string;
    /** Module version. Preferably in major.minor.tiny format. */
    public Version: string;
    /** Module description. */
    public Description?: string;
    /** Whether or not the module is enabled. */
    public Enabled?: boolean = false;
    /** Event handlers to be passed to `ModuleManager`. */
    public Handlers: Record<string, Array<(...args: any[]) => any>> = {};

    constructor(options: IModuleOptions) {
        this.init(options);
    }

    /* Storytime: I thought this was failing for like two weeks because I was
        logging the wrong thing and just couldn't figure out what it was.
        Moral of the story: make sure you're logging the right thing when you're
        getting upset about debugging. It ended up being something in ModuleManager
        that was broken, not in Module. */
    protected handle(event: string, func: (...args: any[]) => any) {
        if (!this.Handlers[event]) { this.Handlers[event] = []; }
        this.Handlers[event].push(func);
    }

    protected init(options: IModuleOptions) {
        this.Name = options.name;
        this.Version = options.version;
        this.Description = options.description;

        // check for required options to enable
        if (typeof options.requiredSettings === "string") {
            this.Enabled = config.get(options.requiredSettings) === true
                ? true
                : false;
        } else if (isArray(options.requiredSettings)) {
            let enable = true;
            for (const option of options.requiredSettings) {
                if (!enable) { break; }
                enable = (config.get(option) === true)
                    ? true
                    : false;
            }
            this.Enabled = enable;
        } else if (!options.requiredSettings) {
            this.Enabled = true;
        } else {
            throw new TypeError("requiredSettings must be string or string[]");
        }
    }
}
