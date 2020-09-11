export type TimeObject = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

export class Utilities {
    /**
     * Wait an amount of time.
     * @param time Time in milliseconds to wait.
     */
    public static async wait(time: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    /**
     * Convert a time (in ms) to other elements.
     * @param time Time to convert, in milliseconds.
     */
    public static convertTime(time: number): TimeObject {
        let seconds = Math.floor(time / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        let hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        const days = Math.floor(hours / 24);
        hours = hours % 24;

        return {
            days,
            hours,
            minutes,
            seconds
        };
    }

    public static formatTime(time: TimeObject): string {
        const response = [];

        if (time.days) {
            response.push(`${time.days} days`);
        }
        if (time.hours) {
            response.push(`${time.hours} hours`);
        }
        if (time.minutes) {
            response.push(`${time.minutes} minutes`);
        }
        if (time.seconds) {
            response.push(`${time.seconds} seconds`);
        }

        // length-1 resposne will just return response[0]
        // length-2 resposne will return "response[0] and response[1]"
        if (response.length <= 2) return response.join('and ');

        // Join together with commas, adding "and" before last one
        return response.join(', ').replace(/, ([^,]*)$/, ', and $1');
    }

    public static chunkArray(array: any[], size: number): any[][] {
        const chunkedArr = [];
        let index = 0;
        while (index < array.length) {
            chunkedArr.push(array.slice(index, size + index));
            index += size;
        }
        return chunkedArr;
    }
}
