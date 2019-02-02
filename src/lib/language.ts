import { Wit } from "node-wit";
import * as config from "config";

export class Language {
    private wit: Wit;

    constructor() {
        this.wit = new Wit({
            "accessToken": config.get("nlp.wit_token")
        });
    }

    public async understand(message: string) {
        if (message.startsWith("!"))
            return { entities: {}, ignored: true };

        let response = await this.wit.message(message, {});

        return response;
    }

    public static accuracy(number: number) {
        return Math.round(number * 1000) / 10;
    }
}