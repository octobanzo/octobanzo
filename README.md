# Octobanzo

**The super powerful [Discord](https://discord.com) bot, powered by machine learning.** 

## Commands
- Moderation


Moderators can use Discord's built-in kick and ban features, removing the need to constantly remember and type `?ban @user <reason>` — especially in an active server this can be a difficult workflow! Just right-click the user and hit the button. As it was meant to be.

If you didn't provide a reason in Discord's reason box, don't fret! Octobanzo will pop up asking you to add a reason later!

Moderate quickly and easily — the typing can wait until the spam is gone.

## Before You Commit:

Please be careful in the `main` branch — I'm currently refactoring the whole project and things are very unstable!

Some of the current changes:

-   Removing Wit in favor of in-process machine learning.
    -   This will require a LOT of training and won't be complete for a long time.
    -   **If you own a decently-active server and would like to donate your chat data to training, please contact me! ([Twitter](https://twitter.com/hadenfletcher)/[Discord](https://discord.gg/zGguGHA))**
-   Adding actual database functionality. I'm writing some custom abstractions over Knex because I don't like some of the other implementations I've seen.
    -   This also means I'll be implementing Redis at some point, which will be incredibly important for the language training features. As I'm writing this, I'm starting to question whether Redis supports knex or if I'll have to do something funky for that. Research!
-   Better module structure. - Yes, this means that `commands.ts` is finally \*actually\* leaving the modules folder. I have no idea why I did that. It seemed smart [at the time](https://github.com/octobanzo/octobanzo/commit/9a72dffb7dde1525a9f88e5196b85b8bc6b5713b#diff-f5b34a5c7dc8c0223d499a5789e0ae59).
    -   Will probably add some sort of `enabled_modules` value to config file. Makes more sense that way! Just drop a module file in, include its filename in config — easy!
-   **...and much more...** (hopefully, if I can get some of these things banged out!)

---

**The super powerful [Discord](https://discord.com) bot.** Currently WIP.

![Last Commit](https://img.shields.io/github/last-commit/hadenpf/octobanzo.svg)
[![Discord Chat](https://img.shields.io/discord/516764994965340161.svg?label=chat&logo=discord&logoColor=fff&style=flat)](https://discord.gg/zGguGHA)

<!-- [![Website](https://img.shields.io/badge/website-octobanzo.hflet.ch-blue.svg?style=flat)](https://octobanzo.hflet.ch) -->


## Usage

Octobanzo is released under the [MIT License](https://github.com/hadenpf/octobanzo/blob/main/LICENSE) (SPDX: MIT).

This means everything the bot does is completely open to inspection, and you can even write your own modules if you'd like to use them on your own or contribute to the mainstream bot!

**Self-hosting won't be officially supported until further notice.** This will give me time to finish development of the core bot before I try to help others with their own setup.

**Machine learning training data will not be made available to the general public.** Due to the potentially-sensitive nature of some of the training data, I will not freely distribute copies of the training data to use for self-hosted instances.

## Haden

's Autism is getting really bad.
