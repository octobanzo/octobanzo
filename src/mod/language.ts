import * as config from "config";
import { Message, TextChannel } from "discord.js";
import { MessageResponse, Wit, WitContext } from "node-wit";
import Bot from "../lib/bot";
import Logger from "../lib/logging";
import { Module } from "../lib/modules";

const debug = Logger.debugLogger("module:language");

export default class Language extends Module {
    private app: Bot;
    private wit: Wit;
    private nlpLogChannel: TextChannel;

    constructor(app: Bot) {
        debug("Initializing...");
        super({
            name: "LanguageProcessor",
            requiredSettings: "nlp.enable",
            version: "0.1.0-dev",
        });

        this.app = app;
        debug("Creating wit instance...");
        this.wit = new Wit({ accessToken: config.get("nlp.wit_token") });
        debug("Wit created. Adding event handlers...");

        // register event handlers
        this.handle("message", this.handleMessage);
        debug("Initialization complete.");
    }

    public static accuracy(input: number): number {
        return Math.round(input * 1000) / 10;
    }

    public static analysis(response: MessageResponse): string {
        const data = response.entities;
        let reply = ``;

        // What was the intent?
        if (data.intent) {
            reply += `Intent: **${data.intent[0].value}** (${Language.accuracy(data.intent[0].confidence)}%)\n`;
        }

        // Did it target someone?
        if (data.contact) {
            reply += `Target: **${data.contact[0].value}** (${Language.accuracy(data.contact[0].confidence)}%)\n`;
        }

        // Detection of sentiment
        if (data.sentiment) {
            reply += `Sentiment: **${data.sentiment[0].value}** (${Language.accuracy(data.sentiment[0].confidence)}%)\n`;
        }

        // Is it a hello?
        if (data.greeting) {
            reply += `Greeting: **yes** (${Language.accuracy(data.greeting[0].confidence)}%)\n`;
        }

        // Does it mention the bot?
        if (data.mentions_bot) {
            reply += `Mentions bot: **yes** (${Language.accuracy(data.mentions_bot[0].confidence)}%)\n`;
        }

        // If there's no data, soulja boy tell 'em
        if (reply.length === 0) {
            reply += `No data.`;
        }

        return reply;
    }

    public async postInit(): Promise<void> {
        if (config.get("nlp.results_channel")) {
            this.nlpLogChannel = this.app.client.channels.get(config.get("nlp.results_channel")) as TextChannel;
        }
        return;
    }

    private async handleMessage(msg: Message): Promise<void> {
        // ignore all bot and ignore-char-starting messages
        if (msg.author.bot
            || msg.content.startsWith(config.get("nlp.ignore_prefix") || null)) {
            return;
        }

        // if in NLP-restricted mode, only analyze messages in test channel
        if (config.get("nlp.restrict")
            && msg.channel.id !== config.get("nlp.test_channel")) {
            return;
        }

        debug("Analyzing message...");
        // now let's analyze the message
        const understanding = await this.wit.message(msg.content.replace(/[\*\_\|\`\~]+/gi, ""), {});
        debug("Got response from wit!");

        // send raw response to master logs, if any
        if (this.nlpLogChannel) {
            debug("Sending understanding to master logs");
            this.nlpLogChannel.send(`\`\`\`json\n${JSON.stringify(understanding, null, 2)}\`\`\``);
        }

        // if it's in test channel, show response
        if (msg.channel.id === (config.get("nlp.test_channel") || null)) {
            debug("Replying in test channel");
            msg.channel.send(Language.analysis(understanding));
        }
    }
}
