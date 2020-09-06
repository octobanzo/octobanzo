import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { Bot } from './bot';
import { Logger } from './logging';

export interface ConfigSchema {
    discord: {
        token: string;
        owner?: string;
    };
    nlp: {
        enable: boolean;
    };
    database: {
        host: string;
        port: string | number;
        db: string;
        auth_source?: string;
        username: string;
        password: string;
    };
    defaults: {
        commands: {
            prefix: string;
        };
        moderation: {
            reason_time: number;
        };
    };
    logging: {
        console: boolean;
        file?: boolean;
        startup: {
            log_guilds: boolean;
        };
    };
    debug?: {
        log_events: {
            ban: boolean;
            kick: boolean;
        };
        auto_unban: {
            enable: boolean;
            user_id: string[];
            guild_id: string[];
        };
    };
}

export class ConfigurationManager {
    public value: ConfigSchema;

    private path;

    constructor(private app: Bot) {
        const configDirectory = path.join(__dirname, '../../config');
        this.path = path.join(configDirectory, `${process.env.NODE_ENV}.yml`);

        if (!fs.existsSync(this.path)) {
            console.error(
                '[WARNING] Config file not found. Please copy "example.yml" to the following filename:\n',
                `Expected path: ${this.path}`
            );
            app.stop(1);
        }

        const configRaw = fs.readFileSync(this.path, { encoding: 'utf8' });
        const config: ConfigSchema = YAML.parse(configRaw);

        const defaultConfigRaw = fs.readFileSync(
            // We do this because `tsc` doesn't copy YAML files to output
            path.join(__dirname, '../../src/lib/configuration_defaults.yml'),
            { encoding: 'utf8' }
        );
        const defaultConfig: ConfigSchema = YAML.parse(defaultConfigRaw);

        this.value = Object.assign({}, defaultConfig, config);

        if (process.env.NODE_ENV.startsWith('dev'))
            Logger.debug('Configuration', {
                ...this.value,
                discord: { ...this.value.discord, token: 'NOPE' }
            });
    }

    public name() {}
}
