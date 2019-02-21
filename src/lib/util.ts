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
    public static async delay(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    /**
     * Convert a time (in ms) to other elements.
     * @param time Time to convert, in milliseconds.
     */
    public static convertTime(time: number): object {
        let seconds = Math.floor(time / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        let days = Math.floor(hours / 24);
        hours = hours % 24;
        return {
            days,
            hours,
            minutes,
            seconds
        };
    }

    public static formatTime(time: { days, hours, minutes, seconds }): string {
        let response = [];

        if (time.days) { response.push(`${time.days} days`); }
        if (time.hours) { response.push(`${time.hours} hours`); }
        if (time.minutes) { response.push(`${time.minutes} minutes`); }
        if (time.seconds) { response.push(`${time.seconds} seconds`); }

        return response.join(", ").replace(/, ([^,]*)$/, ", and $1");
    }
}
