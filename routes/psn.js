/* 

    Playstation related api. This helps differentiate the info we want to grab.
    Get info for profile and games/trophis.

*/
import { getProfileFromAccountId, getProfileShareableLink, getRecentlyPlayedGames, getUserTitles} from "psn-api"
var express = require('express');
var router = express.Router();


/**
 * Notes: creates an object with the trophy counts for each type as well as the total trophies earned.
 */
async function trophyTypeCount(psnAuth, psnAccountID) {
    // setup trophy counts with initial 0 count
    const trophies = {
        Total: 0,
        Platinum: 0,
        Gold: 0,
        Silver: 0,
        Bronze: 0
    }
    // get list of all played games
    const games = await getUserTitles(psnAuth, psnAccountID)

    // get all # earned trophies in list by type
    for (var i = 0; i <= games.totalItemCount; i++) {
        // make sure we have a game. Sometimes the final element will be empty.
        if (games.trophyTitles[i] != undefined) {
            const earnedTrophies = games.trophyTitles[i].earnedTrophies
            trophies.Platinum += earnedTrophies.platinum
            trophies.Gold += earnedTrophies.gold
            trophies.Silver += earnedTrophies.silver
            trophies.Bronze += earnedTrophies.bronze
        } else {
            continue
        }
    }

    trophies.Total = trophies.Platinum + trophies.Gold + trophies.Silver + trophies.Bronze
    return trophies
}

export async function psnProfile(psnAuth, psnAccountID) {
    return {
        profile: getProfileFromAccountId({ accessToken: psnAuth.accessToken }, psnAccountID),
        links: getProfileShareableLink(psnAuth, psnAccountID),
        recent: getRecentlyPlayedGames(psnAuth, { limit: 1, categories: ["ps4_game", "ps5_native_game"] }),
        trophyCounts: trophyTypeCount(psnAuth, psnAccountID)
    }

}