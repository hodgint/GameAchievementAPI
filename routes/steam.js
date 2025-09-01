
/*

    Steam API for games and game states. Requires base URL, Steam API Keys.
    App ID is required for game states.

*/

const baseURL = "http://api.steampowered.com"



/**
 * example:
 * {
    "response": {
        "players": [
            {
                "steamid": "76561198025218590",
                "communityvisibilitystate": 3,
                "profilestate": 1,
                "personaname": "Yobby",
                "commentpermission": 1,
                "profileurl": "https://steamcommunity.com/id/thehometeam/",
                "avatar": "https://avatars.steamstatic.com/0fcb3507d4bb174ca84c29301874d1473d5a5a42.jpg",
                "avatarmedium": "https://avatars.steamstatic.com/0fcb3507d4bb174ca84c29301874d1473d5a5a42_medium.jpg",
                "avatarfull": "https://avatars.steamstatic.com/0fcb3507d4bb174ca84c29301874d1473d5a5a42_full.jpg",
                "avatarhash": "0fcb3507d4bb174ca84c29301874d1473d5a5a42",
                "lastlogoff": 1750527745,
                "personastate": 0,
                "realname": "Travis",
                "primaryclanid": "103582791462930273",
                "timecreated": 1273802818,
                "personastateflags": 0,
                "loccountrycode": "US"
            }
        ]
    }
}
 */
async function getSteamUserInfo(steamAPIKey, steamUserID) {
    const url = `${baseURL}/ISteamUser/GetPlayerSummaries/v1/?key=${steamAPIKey}&steamids=${steamUserID}`
    const header = new Headers()
    header.append("Content-Type", "application/json");
    return await fetch(url, {
        method: "get",
        headers: header
    })
        .then(res => {
            // console.log(res)
            return res.json();
        })
        .then(json => {
            // console.log(json.response.players.player.at(0))
            return json.response.players.player.at(0);
        })
        .catch(error => {
            console.log(error);
        });


}


/**
{
 "response": {
     "game_count": 714,
     "games": [
         {
             "appid": 2100,
             "name": "Dark Messiah of Might & Magic Single Player",
             "playtime_forever": 363,
             "img_icon_url": "5a08cd17d14ccb07a14f316dfa222b18a20960fd",
             "playtime_windows_forever": 185,
             "playtime_mac_forever": 0,
             "playtime_linux_forever": 0,
             "playtime_deck_forever": 0,
             "rtime_last_played": 1689134459,
             "content_descriptorids": [
                 5
             ],
             "playtime_disconnected": 0
         },
 * 
 */
export async function getSteamUserGameInfo(steamAPIKey, steamUserID, includeFree = false, includeAppInfo = false) {
    const url = `${baseURL}/IPlayerService/GetOwnedGames/v1/?key=${steamAPIKey}&steamid=${steamUserID}&include_appinfo=${includeAppInfo}&include_played_free_games=${includeFree}`
    const header = new Headers()
    header.append("Content-Type", "application/json");
    return fetch(url, {
        method: "get",
        headers: header
    })
        .then(res => {
            return res.json();
        })
        .then(json => {
            return json.response
        })
        .catch(error => {
            console.log(error);
        });
}

/**
 * Example: 
    AppID: Plants vs Zombies: Game of the Year - 3590
    {
        "steamID": "76561198025218590",
        "gameName": "Plants vs. Zombies: Game of the Year",
        "achievements": [
            {
                "apiname": "finished_adventure",
                "achieved": 1,
                "unlocktime": 1642009992
            },
            {
                "apiname": "gold_sunflower_trophy",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "izombie_streak",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "vasebreaker_streak",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "survival_streak",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "all_plants",
                "achieved": 1,
                "unlocktime": 1677378805
            },
            {
                "apiname": "tall_tree",
                "achieved": 1,
                "unlocktime": 1677801462
            },
            {
                "apiname": "secret_zombie",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "hypnotize_dancer",
                "achieved": 1,
                "unlocktime": 1593234780
            },
            {
                "apiname": "potato_mine",
                "achieved": 1,
                "unlocktime": 1592792294
            },
            {
                "apiname": "cherry_bomb",
                "achieved": 1,
                "unlocktime": 1593386652
            },
            {
                "apiname": "mustache_mode",
                "achieved": 1,
                "unlocktime": 1677004344
            },
            {
                "apiname": "pea_pool",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "roll_heads",
                "achieved": 1,
                "unlocktime": 1677018964
            },
            {
                "apiname": "grounded",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "penny_pincher",
                "achieved": 1,
                "unlocktime": 1593233765
            },
            {
                "apiname": "sunny_days",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "popcorn",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "good_morning",
                "achieved": 0,
                "unlocktime": 0
            },
            {
                "apiname": "no_fungus",
                "achieved": 1,
                "unlocktime": 1677793386
            },
            {
                "apiname": "minigames",
                "achieved": 1,
                "unlocktime": 1677100735
            }
        ],
        "success": true
    }
}
 */
export async function getSteamUserSpecificGameStats(steamAPIKey, steamUserID, appID) {
    const url = `${baseURL}/ISteamUserStats/GetPlayerAchievements/v1/?key=${steamAPIKey}&steamid=${steamUserID}&appid=${appID}`
    return fetch(url)
        .then(res => {
            return res.json();
        })
        .then(json => {
            return json.playerstats
        })
        .catch(error => {
            console.log(error);
        });
}

/** 
 * {
    "game": {
        "gameName": "ValveTestApp3680",
        "gameVersion": "5",
        "availableGameStats": {
            "achievements": {
                "finished_adventure": {
                    "defaultvalue": 0,
                    "displayName": "Home Lawn Security ",
                    "hidden": 0,
                    "description": "Complete adventure mode ",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/3590/c5f2a807d9add308edbec7c64956418c879b7a83.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/3590/58950747c607bd820881f95c50d6f0b19d8042ac.jpg"
                },
                "gold_sunflower_trophy": {
                    "defaultvalue": 0,
                    "displayName": "Nobel Peas Prize ",
                    "hidden": 0,
                    "description": "Get the golden sunflower trophy ",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/3590/2d9d9ccaa5a7cf7a4be1fbd04254627a01623188.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/3590/154bb9c2fc5c5a4001cdc5e63f9d716275413db8.jpg"
                },
                "izombie_streak": {
                    "defaultvalue": 0,
                    "displayName": "Better Off Dead ",
                    "hidden": 0,
                    "description": "Get to a streak of 10 in I, Zombie Endless ",
                    "icon": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/3590/f0c318d840cc9cff90fc4de1ef6039e38eca139f.jpg",
                    "icongray": "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps/3590/8c0e315113d09db78fe6273ecb769f3808c4f3a5.jpg"
                },
                .... // other achievements
            }
        }
    }
}
 * 
 */
async function getSteamGameAchievmentInfo(steamAPIKey, appID) {
    const url = `${baseURL}ISteamUserStats/GetSchemaForGame/v1/?key=${steamAPIKey}&appid=${appID}`
    return fetch(url)
        .then(res => {
            return res.json();
        })
        .then(json => {
            return json.game
        })
        .catch(error => {
            console.log(error);
        });
}

async function getSteamLastPlayedGame(steamAPIkey, steamUserID) {
    const url = `${baseURL}/IPlayerService/GetRecentlyPlayedGames/v0001/?key=${steamAPIkey}&steamid=${steamUserID}&count=1&format=json`
    return fetch(url)
        .then(res => {
            return res.json();
        })
        .then(json => {
            return json.response.games.at(0)
        })
        .catch(error => {
            console.log(error);
        });
}

/*
    This doesn't work very well. It requires a list of appids that are a hassle to input 
*/
async function getSteamUsersTopGames(steamAPIKey, SteamUserID) {
    const url = `${baseURL}/IPlayerService/GetTopAchievementsForGames/v1/?key=${steamAPIKey}&steamid=${SteamUserID}&language=en&max_achievements=10000`
    return fetch(url)
        .then(res => {
            return res.json();
        })
        .then(json => {
            return json.response
        })
        .catch(error => {
            console.log(error);
        });
}


/**
 * this will loop through all games a user owns and add up any with all the achievements. This TAKES FOREVER!
 */
async function getSteamUsersCompletedGames(steamAPIKey, steamUserID, list = []) {
    const completed = {
        total: 0,
        games: [Array]

    }
    // optionally get the list of games if we don't pass it in. This can save time if we want to get the list before finding all the completed games.
    if (list.length === 0) {
        list = await getSteamUserGameInfo(steamAPIKey, steamUserID, true, false)
    }
    for (var i = 0; i <= list.game_count; i++) {
        // console.log("appID", list.games[i].appid)
        // check to see if the game has a proper appid. if not, skip it.
        if (!('appid' in list.games[i])) {
            continue
        }
  
        const gameInfo = await getSteamUserSpecificGameStats(steamAPIKey, steamUserID, list.games[i].appid);

        // console.log("GameInfo", gameInfo)
        // make sure the game has stats. not all games have this. Any game without achievements.
        if (gameInfo == 'undefined' || gameInfo.success === false) {
            // console.log("No stats for game", list.games[i].appid)
            continue
        }
        // check if the game has all achievements achieved set to 1. This means its been achieved for the user.
        if ("achivements" in gameInfo && gameInfo.achievements.every((item) => item['achieved'] === 1)) {
            // console.log(list.games[i].name, " has been completed!");
            completed.total++
            // @ts-ignore
            completed.games.push(list.games[i].name)
        }
    }
    return completed
}

async function steamProfile(steamAPIKey, SteamUserID) {
    const steamProfile = await getSteamUserInfo(steamAPIKey, SteamUserID)
    const gameList = await getSteamUserGameInfo(steamAPIKey, SteamUserID, false, false)
    const lastPlayed = await getSteamLastPlayedGame(steamAPIKey, SteamUserID)
    const profile = {
        username: steamProfile.personaname,
        profileURL: steamProfile.profileURL,
        avatarLink: steamProfile.avatar,
        gameCount: gameList.game_count,
        lastPlayed: lastPlayed.name
    }
    return profile
}


module.exports = router;
