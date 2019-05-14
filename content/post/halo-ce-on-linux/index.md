---
date: 2019-05-13
---

# How to run Halo Custom Edition on Linux with community mods

I've recently gotten [Halo Custom Edition][hce] working well on my Linux desktop, so I want to document and share the process. Custom Edition is a standalone version of Halo PC (a.k.a. "retail") which supports user-created maps and an editing kit (HEK).

Setting up the HEK will not be a goal and instead I want to focus on setting up a good multiplayer experience. This will involve installing CE, updating it, and installing a few popular community mods:

* HAC2: automatic custom map downloads, UI tweaks, server bookmarking
* Chimera: FOV and widescreen fixes plus other quality of life improvements
* CE Refined: multiplayer and campaign maps rebuilt with a tagset which restores the correct Xbox appearance lost during the game's PC port

Make sure you have your Halo PC product key ready. You'll need it to install CE later. I'll be referencing some Arch linux specifics, but distro shouldn't really matter so just substitute the equivalents from yours.

## System requirements

First off, it's a good idea to start with an up-to-date system and take advantage of any bug fixes and optimizations. For Arch, run `sudo pacman -Syu`. For graphics, I found the best performance and stability running Xorg with the proprietary Nvidia Linux drivers for my 660ti. Following the [Arch wiki][nvidia], I installed:

```sh
sudo pacman -S nvidia nvidia-utils nvidia-settings
```

I found that the [nouveau][] drivers and mesa gave poor framerates compared to the nvidia driver. I also tried using wlroots-based Wayland window managers (like [sway][] and [way-cooler][]) instead of Xorg and experienced lower framerates and frequent crashes requiring restart, so I can't recommend that approach either.

## Creating a Wine prefix

Next, install [Wine][wine] and Winetricks. To get ingame sound working, I needed to install some audio libraries too. I don't know if _all_ these libraries are needed since I gathered the list from a few google results, but it doesn't hurt to install them. You could try only installing Wine and Winetricks in this step and seeing if sound works first.

```sh
sudo pacman -S wine winetricks openal libpulse alsa-plugins mpg123 alsa-lib
```

Now configure a Wine prefix. This is a directory where the Windows system and its "C drive" will be installed. A default wine prefix will be used if you don't specify one, but if you want to isolate applications running under Wine it can be helpful to set a prefix by environment variable. 

```sh
export WINEPREFIX=/home/<you>/wine-prefixes/halo
wineboot
```

It will be necessary to set this environment variable any time you are running Wine and want to use this prefix (e.g. from a new shell). During `wineboot` you may be prompted to install Mono and Gecko. You can cancel these since they're not needed (or set `WINEDLLOVERRIDES=mscoree=d;mshtml=d` to avoid being prompted).

## Installing Halo

Download the CE installer ([mirror 1][hce-download], [mirror 2][download-3]) and the official 1.0.10 patch ([mirror 1][patch-download], [mirror 2][patch-download-2], [mirror 3][download-3]). With the same Wine prefix configured, run:

```sh
# needed by Halo's PidGen.dll to generate a product ID from CD key
winetricks mfc42

# if not installed, multiplayer chat messages will not show up ingame
winetricks msxml4

# install and patch the game
wine halocesetup_en_1.00.exe
wine haloce-patch-1.0.10.exe
```

If for whatever reason the msxml4 installer doesn't work, you can always use Wine to run the installer which ships in Halo's `/redist` directory.

During the CE installer, you will be asked for your retail product key. You do not need to install Gamespy arcade, install for all users, or create a desktop icon. Don't click "Play Now" just yet; close the installer and move on to patching the game. When that's done, I suggest making a start script for the game to make it easier to run:

```sh
#!/bin/bash
export WINEDEBUG=-all
export WINEPREFIX=/home/<you>/wine-prefixes/halo
HALO_HOME="$WINEPREFIX/drive_c/Program Files (x86)/Microsoft Games/Halo Custom Edition"
HALO_OPTS="-console -screenshot -windowed"
cd "$HALO_HOME"
nohup wine haloce.exe $HALO_OPTS &
```

The `WINEDEBUG=-all` variable noticeably improved performance for me during multiplayer matches with a lot of players. You should also set the `$HALO_HOME` variable in your shell because you'll need it later during this guide.

Hopefully the game runs, and you're greeted with the menu music if the audio is working correctly. Head to the video settings and bump the resolution up to your native resolution if available and set framerate to "NO VSYNC". Don't worry about vertical tearing or if your native resolution was not an option; we'll use a mod later to address this. It is not recommended to use Halo's `-vidmode <width>,<height>,<refresh>` argument or built-in Vsync as it introduces input latency.

![Halo's video settings menu](menu.jpg)

While you're in the settings menu, also head over to sound options and set quality to HIGH.

Start a LAN match on _Beaver Creek_ and test the following:

* Chat messages are visible (you should see a "welcome \<name\>" message when you join")
* Pick up the active camo powerup and make sure the shader looks correct. If it's just semitransparent rather than refractive, your graphics card is probably not recognized by the game. Obtain its PCI device ID (for Nvidia, shown in `nvidia-settings`) and add it to the vendor's section of `$HALO_HOME/config.txt`. More details can be found in [OpenCarnage.net's guide][pc-guide]
* Sounds are working correctly -- if not you may need to make CE recognize your sound card by adding its device ID to the relevant `$HALO_HOME/config.txt` section. Again, [more details here][pc-guide]
* Bullet decals should appear. Halo doesn't create a decal for the first bullet fired in a game, so fire a couple! If the decals do not appear, double check the decals option in the game's video settings
* Grenades should produce particles and weapons should produce muzzle flash. If not, there may be an issue rendering certain transparent shader types. I had this issue, but am unsure of the root cause because a new wine prefix and updated nvidia driver resolved it
* Hit Ctrl + F12 to see a framerate counter. The framerate should not be capped at 30 or 60, and on modern hardware it should be in the hundreds
* Mouse input feels smooth and responsive. You may need to strike a balance between DPI on your mouse and ingame sensitivity options

The field of view will be too narrow if you are using a widescreen display. No worries, we'll fix that later.

![Testing visuals on Beaver Creek](testing.jpg)

## Installing Halo Anticheat (HAC2)

HAC2 is a client mod which adds some long-needed features to CE:

* Automatic custom map downloads when joining servers
* FOV control
* Server bookmarking
* Better chat styling

Despite the name, it doesn't actually include any anti-cheat as this has fallen to server-side mods to implement. To install HAC2, download the release from the [official site][hac2] ([mirror][hac2-mirror]) and place it in Halo's `controls` directory:

```sh
wget http://client.haloanticheat.com/release.zip
unzip release.zip
mv release/loader.dll $HALO_HOME/controls
```

HAC2 can be configured at runtime, but to make things persistent you can create a config file in `~/My Games/Halo CE/hac/preferences.ini`:

```ini
fov=90
hud_ratio_fix=0
play_during_queue=1
```

These and other options are documented on the [HAC2 site][hac2]. We specifically disable HAC2's widescreen HUD fix because we will install another mod which implements it better.

Give the game a run again using the script from earlier. You should find that the FOV is better suited to widescreen. You can change the FOV ingame by opening the console with `~` and entering `fov <value>`. The function keys from F4 up now control HAC2 features like server bookmarking, HUD colouring. You should also now be able to choose your native resolution in the video settings if it was previously unavailable.

HAC2 is incompatible with [OpenSauce][os] as used for [SPV3][spv3]. While OpenSauce also implements FOV control, map downloads, post-processing effects, [and more][os-trailer], its mostly used for custom campaigns and the map downloading is unreliable. If you'd like to use both, I suggest a second Wine prefix so you don't have to keep switching DLLs out.

## Installing Chimera

Chimera is another mod which further enhances the Halo client. It is compatible with HAC2 or OpenSauce. If you are not planning on using a controller, download build 581 from the [enhancement guide][pc-guide] or [click here][chimera-581]. Otherwise use build 49 from the [development thread][chimera]. Either way, install chimera into the `controls` directory like HAC2:

```sh
curl "https://opencarnage.net/applications/core/interface/file/attachment.php?id=922" --output chimera-581.zip
unzip chimera-581.zip
mv chimera.dll $HALO_HOME/controls
```

If we just left it here, Chimera's features will work but framerate is negatively impacted. I also ran into crashing issues with build 49. Both of these are resolved by installing DirectX 9 in the Wine prefix rather than using Wine's built in DirectX support:

```sh
winetricks d3dx9
```

Give the game another launch and the framerate should be back in the hundreds. Next, we'll configure Chimera using by editing `~/My Games/Halo CE/chimera/chimerasave.txt`:

```
chimera_skip_loading "1"
chimera_widescreen_fix "1"
chimera_interpolate "ultra"
chimera_auto_center "2"
chimera_block_mouse_acceleration "1"
chimera_disable_buffering "0"
chimera_fov_fix "1"
chimera_uncap_cinematic "1"
chimera_sniper_hud_fix "1"
chimera_af "1"
chimera_throttle_fps "120"
chimera_block_firing_particles "0"
chimera_block_vsync "1"
chimera_modded_stock_maps "1"

chimera_block_gametype_indicator "1"
chimera_safe_zones "1"
chimera_hud_kill_feed "1"
chimera_mouse_sensitivity "6" "6"
chimera_split_screen_hud "1"
```

The number of options is quite extensive, with some being more preferential (second group above). Chimera even supports lua scripting, so see the [complete documentation][chimera-docs] for more info.

* I saw it recommended online to use `chimera_disable_buffering 1` as this improves input latency, but this drove my framerate below 60 again and I reverted to using buffering
* `chimera_af` enables anisotropic filtering. This did not have any noticeable effect on framerate
* `chimera_interpolate` smooths out the 30 FPS character and weapon animations
* `chimera_throttle_fps` can be used to set a vsync without using Halo's option

The author Kavawuvi is actively developing this mod towards a 1.0 release ([work tracker][chimera-tracker]). An alpha 1.0 release is available in the latest page of the [development thread][chimera] but still lacks automatic map downloads, so we still need HAC2 for now. Definitely keep an eye on this.

## Refined stock maps

The [Halo CE Refined project][refined] by Moses, Jesse, and Vaporeon is a rebuild of all stock campaign and multiplayer maps with the refined tagset which faithfully reproduces the classic Xbox visuals and fixes issues introduced in the port to PC by Gearbox. It also includes higher resolution HUD elements. Download the newest versions here:

* [Refined singleplayer][refined-sp-1] (1.3 GB) ([mirror][refined-sp-2])
* [Refined multiplayer][refined-mp] (37 MB)
* [Refined UI][refined-ui] (820 KB)

Once these archives have been downloaded, extract all `.map` files to `$HALO_HOME/maps`. Overwrite or backup the existing multiplayer and UI maps. The refined multiplayer maps above have forged checksums which allows them to be used in multiplayer. The UI map restores the Halo ring shader and adds a singleplayer menu to Custom Edition so you can load the refined SP maps without having to use the console.

![Refined Bloog Gulch screenshot](refined-mp.jpg)

_Refined Bloog Gulch, showing the fixed teleporter shader and high resolution HUD (split screen version)_

![Refined AotCR mission](refined-sp.jpg)

_Refined Assault on the Control Room mission, showing fixed jackal shield and Assault Rifle shaders._

## Downloading custom maps

Custom maps can be downloaded by joining dedicated servers, or by downloading them from popular release sites:

* [Halomaps.org](http://halomaps.org/)
* [Halo CE3](https://haloce3.com/)

## Tweaks

Halo has a built-in lisp-like scripting language which is used in its campaign maps, HEK console, and the ingame console. It supports a huge number of commands for which you can find [semi-complete references online][halo-scripts]. Halo will automatically run any commands present in `$HALO_HOME/init.txt` at startup, so you can use this to quickly launch into a map or setup preferences. For example, I set `multiplayer_hit_sound_volume 1` to increase the volume of the "ping" sound made when damage is dealt in multiplayer.

Unfortunately, enabling MSAA in the `nvidia-settings` control panel resulted in a black screen for Halo. FXAA worked.

[wine]: https://www.winehq.org/
[hce]: https://www.halopedia.org/Halo_Custom_Edition
[nouveau]: https://nouveau.freedesktop.org/wiki/
[nvidia]: https://wiki.archlinux.org/index.php/NVIDIA
[sway]: http://swaywm.org/
[way-cooler]: https://github.com/way-cooler/way-cooler
[hce-download]: http://hce.halomaps.org/index.cfm?fid=410
[patch-download]: https://www.bungie.net/en/Forums/Post/64943622?page=0&path=0
[patch-download-2]: http://hce.halomaps.org/index.cfm?fid=6798
[download-3]: http://vaporeon.io/hosted/halo/original_files/
[pc-guide]: https://opencarnage.net/index.php?/topic/7383-the-halo-ce-ultimate-enhancement-guide-updated-260319/
[os]: https://www.halopedia.org/OpenSauce
[spv3]: https://www.reddit.com/r/halospv3/
[os-trailer]: https://www.youtube.com/watch?v=TTDaVb19_PQ
[hac2]: http://198.98.120.174/index.html
[hac2-mirror]: http://blog.haloanticheat.com/
[chimera]: https://opencarnage.net/index.php?/topic/6916-chimera-build-49/
[chimera-tracker]: https://docs.google.com/spreadsheets/d/1WzUCMm99xvPDXumGyC4tmmWb_BmJ-ZR-caQUcdAfeRk/edit#gid=0
[chimera-581]: https://opencarnage.net/applications/core/interface/file/attachment.php?id=922
[chimera-docs]: https://docs.google.com/document/d/1OmkwbJTLmuVEqJGTtkLlbRpbdZ_QBHoj86MzC7mXM_g/edit#heading=h.j2mjtefu4gim
[halo-scripts]: https://andrew.gg/scripts/00reference.html
[refined]: https://www.reddit.com/r/HaloCERefined/
[refined-mirror]: http://vaporeon.io/halo-refined/
[refined-sp-1]: https://www.reddit.com/r/HaloCERefined/comments/9l9ujl/downloads/
[refined-sp-2]: https://haloce3.com/downloads/singleplayer/modified-singleplayer/refined-halo-1-singleplayer-maps/
[refined-mp]: http://vaporeon.io/hosted/halo/archives/haloce_mp_semirefined_r13_en.7z
[refined-ui]: http://vaporeon.io/hosted/halo/archives/haloce_stock_ui_fixed_v3.7z
