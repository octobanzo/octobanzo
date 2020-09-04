import * as fs from 'fs';
import * as path from 'path';
import * as YAML from 'yaml';
import { Bot } from './bot';

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
        const configPath = path.join(configDirectory, `${process.env.NODE_ENV}.yml`);

        if (!fs.existsSync(configPath)) {
            console.error(
                '[WARNING] Config file not found. Please copy "example.yml" to the following filename:\n',
                `Expected path: ${configPath}`
            );
            app.stop(1);
        }

        const configRaw = fs.readFileSync(configPath, { encoding: 'utf8' });
        const config: ConfigSchema = YAML.parse(configRaw);

        const defaultConfigRaw = fs.readFileSync(
            path.join(__dirname, '../../src/lib/configuration_defaults.yml'),
            { encoding: 'utf8' }
        );
        const defaultConfig: ConfigSchema = YAML.parse(defaultConfigRaw);

        this.value = Object.assign({}, defaultConfig, config);
    }
}
