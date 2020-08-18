import { get as conf } from 'config'
import { Message, TextChannel } from 'discord.js'
import { MessageResponse, Wit, WitContext } from 'node-wit'
import Bot from '../lib/bot'
import { Module } from '../lib/modules'

export default class Language extends Module {
	private app: Bot
	private wit: Wit
	private nlpLogChannel: TextChannel

	constructor(app: Bot) {
		super({
			requiredSettings: 'nlp.enable',
			version: '0.1.0-dev'
		})

		this.app = app

		this.app.log.debug('Creating wit instance...')
		this.wit = new Wit({ accessToken: conf('nlp.wit_token') })
		this.app.log.debug('Wit created. Adding event handlers...')

		// register event handlers
		this.handle('message', this.handleMessage)
		this.app.log.trace('Initialization complete.')
	}

	public static accuracy(input: number): number {
		return Math.round(input * 1000) / 10
	}

	public static analysis(response: MessageResponse): string {
		const data = response.entities
		let reply = ''

		// What is the intent?
		if (data.intent) {
			reply += `Intent: **${data.intent[0].value}** (${Language.accuracy(
				data.intent[0].confidence
			)}%)\n`
		}

		// Is it an insult?
		if (data.insult) {
			reply += `Insult: **${data.insult[0].value}** (${Language.accuracy(
				data.insult[0].confidence
			)}%)\n`
		}

		// Does it target someone?
		if (data.contact) {
			reply += `Target: **${data.contact[0].value}** (${Language.accuracy(
				data.contact[0].confidence
			)}%)\n`
		}

		// Detection of sentiment
		if (data.sentiment) {
			reply += `Sentiment: **${data.sentiment[0].value}** (${Language.accuracy(
				data.sentiment[0].confidence
			)}%)\n`
		}

		// Is it a hello?
		if (data.greeting) {
			reply += `Greeting: **yes** (${Language.accuracy(data.greeting[0].confidence)}%)\n`
		}

		// Does it mention the bot?
		if (data.mentions_bot) {
			reply += `Mentions bot: **yes** (${Language.accuracy(
				data.mentions_bot[0].confidence
			)}%)\n`
		}

		// If there's no data, soulja boy tell 'em
		if (reply.length === 0) {
			reply += 'No data.'
		}

		return reply
	}

	public async understand(
		message: string,
		context?: WitContext
	): Promise<MessageResponse> {
		return this.wit.message(message, context || {})
	}

	public async postInit(): Promise<void> {
		if (conf('nlp.results_channel')) {
			this.nlpLogChannel = this.app.client.channels.get(
				conf('nlp.results_channel')
			) as TextChannel
		}
		return
	}

	private async handleMessage(msg: Message): Promise<MessageResponse> {
		// ignore all bot and ignore-char-starting messages
		if (msg.author.bot || msg.content.startsWith(conf('nlp.ignore_prefix') || null))
			return

		// if in NLP-restricted mode, only analyze messages in test channel
		if (conf('nlp.restrict') && msg.channel.id !== conf('nlp.test_channel')) return

		this.app.log.trace('Analyzing message...')
		// now let's analyze the message
		const understanding = await this.understand(msg.content.replace(/[*_|`~]+/gi, ''), {
			// state: [msg.author.id],
		})
		this.app.log.trace('Got response from wit!')

		// send raw response to master logs, if any
		if (this.nlpLogChannel) {
			this.app.log.trace(`Sending understanding for message ${msg.id} to master logs`)
			this.nlpLogChannel.send(
				`\`\`\`json\n${JSON.stringify(understanding, null, 2)}\`\`\``
			)
		}

		// if it's in test channel, show response
		if (msg.channel.id === (conf('nlp.test_channel') || null)) {
			this.app.log.trace(`Replying to NLP message ${msg.id} in test channel`)
			msg.channel.send(Language.analysis(understanding))
		}

		return understanding
	}
}
