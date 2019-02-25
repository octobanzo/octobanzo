import { get as conf } from "config";
import { Client } from "discord.js";
import { isArray } from "util";
import Logger from "./logging";
import Bot from "./bot";

let app: Bot;

export class ModuleManager {
    /** All loaded modules. */
    public modules: Module[] = [];
    private handlers: Record<string, Array<(...args: any[]) => any>> = {};

    constructor(αpp: Bot) {
        app = αpp;
    }

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

    public postInit() {
        for (const module of this.modules) {
            if (module.postInit) {
                module.postInit();
            }
        }
    }
}

export interface IModuleOptions {
    /** Module version. Preferably in incremental major.minor.tiny format. */
    version: string;
    /** A brief description of the module. */
    description?: string;
    /** Settings required to enable module. Only `boolean` values. */
    requiredSettings?: string | string[];
}

export class Module {
    /** Module name. */
    public Name: string = this.constructor.name;
    /** Module version. Preferably in incremental major.minor.tiny format. */
    public Version: string;
    /** A brief description of the module. */
    public Description?: string;
    /** Whether or not the module is enabled. */
    public Enabled?: boolean = false;
    /** Event handlers to be passed to `ModuleManager`. */
    public Handlers: Record<string, Array<(...args: any[]) => any>> = {};

    constructor(options: IModuleOptions) {
        this.Version = options.version;
        this.Description = options.description;

        // check for required options to enable
        try {
            if (typeof options.requiredSettings === "string") {
                this.Enabled = conf(options.requiredSettings) === true
                    ? true
                    : false;
            } else if (isArray(options.requiredSettings)) {
                let enable = true;
                for (const option of options.requiredSettings) {
                    if (!enable) { break; }
                    enable = (conf(option) === true)
                        ? true
                        : false;
                }
                this.Enabled = enable;
            } else if (!options.requiredSettings) {
                this.Enabled = true;
            } else {
                throw new TypeError("requiredSettings must be string or string[]");
            }
        } catch (err) {
            this.Enabled = false;
            app.log.debug(`Couldn't find required setting! Disabling module. (${this})`);
        }
    }

    public postInit?();

    /* Storytime: I thought this was failing for like two weeks because I was
        logging the wrong thing and just couldn't figure out what it was.
        Moral of the story: make sure you're logging the right thing when you're
        getting upset about debugging. It ended up being something in ModuleManager
        that was broken, not here. */
    protected handle(event: string, func: (...args: any[]) => any) {
        if (!this.Handlers[event]) { this.Handlers[event] = []; }
        this.Handlers[event].push(func);
    }

    public toString(): string {
        return `${this.Name} @ ${this.Version}`;
    }
}
