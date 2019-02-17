import { throws } from "assert";
import * as config from "config";
import * as Discord from "discord.js";
import * as pino from "pino";
import Commands from "../mod/commands";
import { default as modulesList } from "../mod/index";
import Language from "../mod/language";
import Logger from "./logging";
import { ModuleManager } from "./modules";

const debug = Logger.debugLogger("bot");
const debugClient = Logger.debugLogger("bot:client");
const debugInit = Logger.debugLogger("bot:init");
const debugInitDiscord = Logger.debugLogger("bot:init:discord");
const debugInitDb = Logger.debugLogger("bot:init:database");

export default class Bot {
    public client: Discord.Client;
    public user: Discord.ClientUser;
    public log: pino.Logger;
    public modules: ModuleManager;
    public commands: Commands;

    constructor() {
        this.log = new Logger().lib;
        this.modules = new ModuleManager();

        this.client = new Discord.Client({
            disableEveryone: true,
            disabledEvents: [
                "PRESENCE_UPDATE",
                "TYPING_START",
            ],
        });

        this.init();
    }

    private async init(): Promise<void> {
        this.log.info("Bot started.");

        this.client.on("ready", async () => {
            debugInitDiscord("Discord client ready.", { tag: this.client.user.tag, id: this.client.user.id });
            this.user = this.client.user;
            this.log.info(`Discord connected.`, { tag: this.user.tag, id: this.user.id });

            this.modules.postInit();
        });

        this.client.on("error", async (err: Error) => {
            debugClient(`Client error\n${err}`);
            this.log.error(err, `Client error!`);
        });

        try {
            debugInit("Registering modules...");
            for (const modType of modulesList) {
                const mod = new modType(this);
                this.modules.add(mod);
                if (modType.name === "Commands") { this.commands = mod as Commands; }
            }
            this.modules.init(this.client);
            debugInit("Modules registered.");
        } catch (err) {
            this.log.error(err, "Error setting up modules.");
            return process.exit(1);
        }

        try {
            debugInitDiscord("Connecting to Discord...");
            await this.client.login(config.get("discord.token"));
        } catch (err) {
            this.log.error(err, "Could not log into Discord!");
            return process.exit(1);
        }

        return;
    }
}
