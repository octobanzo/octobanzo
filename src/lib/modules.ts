import * as config from "config";
import { Client } from "discord.js";
import { isArray } from "util";

export class ModuleManager {
    public modules: Module[] = [];

    private handlers: Record<string, Array<(...args: any[]) => any>> = {};

    public init(client: Client) {
        for (const module of this.modules) {
            if (module.Handlers) {
                for (const eventName in module.Handlers) {
                    // if an array for this event doesn't exist, create one before trying to push
                    if (!this.handlers[eventName]) { this.handlers[eventName] = []; }
                    for (const handler of module.Handlers[eventName]) {
                        this.handlers[eventName].push(handler);
                    }
                }
            }
        }

        this.addHandlers(client);
    }

    public add(...module: Module[]) {
        for (const mod of module) {
            this.addModule(mod);
        }

        return this;
    }

    private addHandlers(client: Client) {
        for (const event in this.handlers) {
            for (const func of this.handlers[event] || []) {
                client.on(event, func);
            }
        }
    }

    private addModule(module: Module) {
        if (module.Enabled) {
            this.modules.push(module);
        } else {
            return;
        }
    }
}

export interface IModuleOptions {
    name: string;
    version: string;
    description?: string;
    requiredSettings?: string | string[];
}

export class Module {
    public Name: string;
    public Version: string;
    public Description?: string;
    public Enabled?: boolean = false;
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
            this.Enabled = config.get(options.requiredSettings)
                ? true
                : false;
        } else if (isArray(options.requiredSettings)) {
            for (const option of options.requiredSettings) {
                this.Enabled = config.get(option)
                    ? true
                    : false;
            }
        } else {
            this.Enabled = true;
        }
    }
}
