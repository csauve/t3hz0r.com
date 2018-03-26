# The GuiltySpark script engine
<time>2013-10-20</time>

If you're unfamiliar with my old project GuiltySpark, check out this [introductory post](/posts/2013-10-29-guiltyspark). In short, it was an attempt to create a program that played Halo by itself. This post will detail the solution I came up with back in 2010 to drive the behaviour of the bot.

At the core of the bot are user-programmable scripts. These are responsible for giving the bot behaviour by reading data from the game memory interface and performing actions like moving the player, aiming, or clicking. The goal of the script engine was to determine which action the bot should be taking at any given time. In order to quickly react to changes in the game environment, the script was run around 100 times per second in its own thread.

Maybe calling it a script isn't the best term, because it's mainly describing a decision tree. But it does have support for reading and writing from registers, and you can write conditional logic with it.

```sh
*[1.0] GOTO_CLOSEST_ENEMY !3($9);
[0.5] AIM !1($9);
*[$13] SHOOT_AT_THEM {
    *[1.0] CLICK_DOWN !6(1);
    *[0.7] SLEEP !8(30);
    [0.5] CLICK_UP !6(0);
}
```

You'll have to forgive me for the magic numbers--it made sense at the time, but I was also the only one using this scripting system :) These days I would probably rely on some embeddable scripting language like lua. So how's it work?

Within a block `{ }`, or at the top-level of the script, you can define "decision nodes". Each decision node is prefixed with a priority expression, like `[$13]` or `[0.5]`. Following that is an arbitrary name for what the node does, like `SHOOT_AT_THEM`, and then there's a block or action like `!3($9)`.

Each time the script executes, the highest priority decision node is chosen. If that node ends with a block, execution recurses into that block. If it ends with an action, that action is performed. An asterisk `*` before the priority expression means the next highest priority node will be executed once the node has completed. Actions are numerically-coded, for example `!3($9)` means run action `3` (navigate to player index) with variable parameter `$9` (the player index of the nearest player). Variables can also be used in priority expressions with operators in reverse polish notation, allowing the decision path through the tree to depend on the bot's situation.

What this script basically did was told the bot to always navigate towards and aim at the nearest enemy player, and if that player was visible to the bot (`$13` > `0.5`) then click the left mouse button to shoot at it. Let's look at something more complicated:

```sh
#!100

[0 $15 =] INIT {
    *[1] stop_init !9(1);
    *[1] start_aimbot !11(1);
}

[0.5] RUN {
    *[10] debug_im_running !0(0);

    [$21 0 =] IF_DEAD {
        [1] chat !37(2);
    }

    [0.5] IF_NOT_DEAD {
        *[7] get_new_target_closest !1($9);

        *[5] MANAGE_WEAPONS {
            >include_weapon_management.txt
        }

        *[4] ZOOM {
            >include_zooming.txt
        }

        *[3] ATTACK {
            [$49 $13 |] IF_TARGET_VISIBLE {
                *[$15 0 > 2 *] reset_counter !9(0);
                *[1] decrement_counter !9($15 1 -);

                *[1] disable_look_ahead !14(0);
                *[1] enable_strafe !24(1);
                *[$15 -7 <] DO_ATTACK {
                    >include_attack.txt
                }

                [0.5] nop !99(0);
            }
            [0.5] TARGET_NOT_VISIBLE {
                *[$15 0 < 2 *] reset_counter !9(0);
                *[1] increment_counter !9($15 1 +);

                *[1] disable_strafe !24(0);
                *[$15 10 >] enable_look_ahead !14(1);
                *[$15 10 >] reload !29(0);

                [0.5] nop !99(0);
            }
        }

        *[2] goto_player !3($9);
    }
}
```

When I had memorized all the action and variable code numbers, this script actually made a lot of sense. Some of the complexity could be hidden by including decision trees from other files, like `>include_attack.txt`. This script was capable of:

* Taunting other players when it had died. Very entertaining :)
* Navigating to the nearest enemy player
* Deciding which of its two weapons to use based on target distance, reserve ammunition, and weapon overheating
* Zoom in to see the target better. This was more done for show, because the bot "sees" by reading game memory anyway
* Facing the direction it's walking when not in combat, but otherwise facing its target
* Choosing the best way to attack the target (grenades, melee, shooting)
* Reloading weapons when it's safe
* Making itself a harder target to hit by walking in a random pattern during combat, called "strafing" in gaming terms

These behaviours, along with the smoothing and error I introduced into the aimbot, made the bot very believable. When you fed these scripts into GuiltySpark and clicked the "run" button, you could sit back with some popcorn and watch the bot play a match of Halo:

<iframe width="640" height="480" src="//www.youtube.com/embed/SpogBHQXg5k" frameborder="0" allowfullscreen></iframe>

I did win matches from time to time, but mostly against inexperienced players. The bot wasn't smart enough to move strategically, take cover, and acquire better weapons. It lacked the intuition that human players have after hundreds of hours of experience.