# Octobanzo

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ff0fbaeb05784de5bafe4f70ec9fe2d9)](https://app.codacy.com/app/hadenpf/octobanzo)

A commandless conversational [Discord](https://discordapp.com) bot.

Official Discord server: <https://discord.gg/zGguGHA>

## Commandless
The bot picks up all clues from context and conversation. I've spent hours training the bot on [wit.ai](https://wit.ai) (for my own instance) to the point where it can pick up things like the intent behind and overall sentiment expressed by a message; whether it was an insult, compliment, or joke; as well as deciding whether or not a message was aimed at it or someone else.

### Example: Banning a Member
In my official instance, I've nailed the language processing system down to a point where it can decipher "`ban me`" (a joke) from "`ban <@Sam>`" (a command), even stripping the "`Sam`" (in real use, a user ID) from the message and passing it on directly to the bot application.

### Self-Host with Training Data
Unfortunately, due to privacy concerns and other reasons surrounding my bot's training data, I'm not able to share it with others. In the future I may help others set up Octobanzo instances with similar training data, but I have yet to find a way that's efficient and effective

## Language Processing
Octobanzo does language processing via [wit.ai](https://wit.ai), using the `node-wit` library.

## License
Octobanzo is released under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License.
 
**DO**
  - Download and host your own version of Octobanzo.
  - Give clear credit to the original author(s) of Octobanzo when modifying its code.
  - License modified versions of Octobanzo under this same license.

**DON'T**
  - Make money off of Octobanzo, or any part of it.
  - Remove any credit or attribution provided to the author(s) of Octobanzo within the repository, whatsoever.
  - Allow others to make money off of Octobanzo, or any part of it.

Read the full license in the [LICENSE](https://github.com/hadenpf/octobanzo/blob/master/LICENSE) file.

## Thank you
I sincerely thank you for your interest in Octobanzo, seeing as it's been an extremely fun project for me to put together.