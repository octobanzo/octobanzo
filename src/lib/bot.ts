import { throws } from "assert";
import * as config from "config";
import * as Discord from "discord.js";
import * as pino from "pino";
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
    public nlpLogChannel: Discord.TextChannel;

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
        this.client.on("ready", async () => {
            debugInitDiscord("Discord client ready.");
            this.user = this.client.user;
            this.log.info(`Discord connected.`, { tag: this.user.tag, id: this.user.id });
            if (config.get("nlp.results_channel")) {
                this.nlpLogChannel = this.client.channels.get(config.get("nlp.results_channel")) as Discord.TextChannel || undefined;
            }
        });

        this.client.on("error", async (err: Error) => {
            debugClient("Client error\n${err]");
            this.log.error(err, `Client error!`);
        });

        try {
            debugInit("Registering modules...");
            this.modules.add(new Language(this));
            this.modules.init(this.client);
            debugInit("Modules registered.");
            debugInitDiscord("Connecting to Discord...");
            await this.client.login(config.get("discord.token"));
        } catch (err) {
            this.log.error(err, "Could not log into Discord!");
        }
    }
}
