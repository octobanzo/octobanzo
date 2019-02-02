import * as Discord from "discord.js";
import * as config from "config";
import { Language } from "./language";

export class BotApp {
    client: Discord.Client;
    nlp: Language;
    nlp_logs: Discord.TextChannel;

    constructor() {
        this.init();
        if (config.get("nlp.enable"))
            this.nlp = new Language();
    }

    private async init() {
        this.client = new Discord.Client({
            "disabledEvents": [
                "PRESENCE_UPDATE",
                "TYPING_START"
            ]
        });

        this.client.login(config.get("discord.token") || config.get("token"));

        this.client.on("ready", async () => {
            console.log(`Connected to Discord as ${this.client.user.tag}.`);
            this.nlp_logs = this.client.channels.get(config.get("nlp.results_channel")) as Discord.TextChannel;
        });

        this.client.on("message", async (msg: Discord.Message) => {
            if (msg.author.bot)
                return;
            if (config.get("nlp.test_channel"))
                if (msg.channel.id !== "540995685458116640")
                    return;
            if (this.nlp) {
                const result = await this.nlp.understand(msg.content.replace(/[\*\_\|\`\~]+/gi, ""));
                const data = result.entities;

                if (result["ignored"])
                    return;

                // send raw response to master logs
                this.nlp_logs.send(`\`\`\`json\n${JSON.stringify(result, null, 2)}\`\`\``);

                // direct response for debugging
                let response = ``;
                if (process.env.NODE_ENV !== "development") return;

                // Intent detection
                if (data.intent)
                    response += `Intent: **${data.intent[0].value}** (${Language.accuracy(data.intent[0].confidence)}%)\n`;

                // Targeting
                if (data.contact)
                    response += `Target: **${data.contact[0].value}** (${Language.accuracy(data.contact[0].confidence)}%)\n`;

                // Detection of sentiment
                if (data.sentiment)
                    response += `Sentiment: **${data.sentiment[0].value}** (${Language.accuracy(data.sentiment[0].confidence)}%)\n`;

                if (data.greeting)
                    response += `Greeting: **yes** (${Language.accuracy(data.greeting[0].confidence)}%)\n`;

                if (data.mentions_bot)
                    response += `Mentions bot: **yes** (${Language.accuracy(data.mentions_bot[0].confidence)}%)\n`;

                if (response.length === 0)
                    response += `No data.`;

                // TEST!
                "Testing 123: commit signing";

                msg.channel.send(response);
            }
        });
    }
}