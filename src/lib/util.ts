import Bot from "./bot";

export default class Utilities {
    private app: Bot;

    constructor(app?: Bot) {
        this.app = app || null;
    }

    /**
     * Wait an amount of time.
     * @param time Time in milliseconds to wait.
     */
    public async delay(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
}
