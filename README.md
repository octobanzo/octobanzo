**Please be careful in the repository at the moment — I'm currently refactoring the whole project and things are very unstable!**

See **[Before You Commit](#before-you-commit)** for more info.

---

# Octobanzo

**The super powerful [Discord](https://discord.com) bot, powered by machine learning.** Currently work-in-progress.

![Last Commit](https://img.shields.io/github/last-commit/hadenpf/octobanzo.svg)
[![Discord Chat](https://img.shields.io/discord/516764994965340161.svg?label=chat&logo=discord&logoColor=fff&style=flat)](https://discord.gg/zGguGHA)

<!-- Will change website before release. -->
<!-- [![Website](https://img.shields.io/badge/website-octobanzo.hflet.ch-blue.svg?style=flat)](https://octobanzo.hflet.ch) -->

## Features

### Moderation Heaven

Moderators can use Discord's built-in kick and ban features, removing the need to constantly remember and type `?ban @user <reason>` — especially in an active server this can be a difficult workflow! Just right-click the user and hit the button. As it was meant to be.

If you didn't provide a reason in Discord's reason box, don't fret! Octobanzo will pop up asking you to add a reason later!

Moderate quickly and easily — you don't even have to do anything while the spam is happening.

<!-- ### Language Processing -->
<!-- TODO: NLP section -->

## Before You Commit:

Please note that Octobanzo is currently undergoing major refactoring.

Here is a short list of some of the work-in-progress features:

-   Removing Wit in favor of in-process machine learning.
    -   This will require a LOT of training and won't be complete for a long time.
    -   **If you own a decently-active server and would like to donate your chat data to training, please contact me! ([Twitter](https://twitter.com/hadenfletcher)/[Discord](https://discord.gg/zGguGHA))**
-   Adding actual database functionality. I'm writing some custom abstractions over Knex because I don't like most of the other implementations I've seen.
    -   This also means I'll be implementing Redis at some point, which will be incredibly important for the language training features. As I'm writing this, I'm starting to question whether Redis supports knex or if I'll have to do something funky for that. Research!
-   Better module structure. - Yes, this means that `commands.ts` is finally \*actually\* leaving the modules folder. I have no idea why I did that. It seemed smart [at the time](https://github.com/octobanzo/octobanzo/commit/9a72dffb7dde1525a9f88e5196b85b8bc6b5713b#diff-f5b34a5c7dc8c0223d499a5789e0ae59).
    -   Will probably add some sort of `enabled_modules` value to config file. Makes more sense that way! Just drop a module file in, include its filename in config — easy!
-   **...and much more...** (hopefully, if I can get some of these things banged out!)

## License

Octobanzo is released under the [MIT License](./LICENSE) (SPDX: MIT).

This means everything the bot does is completely open to inspection, and you can even write your own modules if you'd like to use them on your own or contribute to the mainstream bot!

### Can I self-host?

**Octobanzo will not officially support self-hosting until further notice.** This will give time to finish development of the core bot before I try to help others with their own setup.

**Machine learning training data will not be made available to the general public.** Due to the potentially-sensitive nature of some of the training data, I will not freely distribute copies of the training data to use for self-hosted instances.

See the [Octobanzo Listener](https://github.com/octobanzo/listener) project for more details on our machine learning training.
