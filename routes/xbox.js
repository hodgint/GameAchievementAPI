import express from 'express'
var router = express.Router();

const xboxAPI = require('XboxLiveAPI');

async function xboxProfile(xboxAuth, xboxUID) {
    const playerSettings = await XboxLiveAPI.getPlayerSettings(xboxUID, {
        userHash: xboxAuth.user_hash,
        XSTSToken: xboxAuth.xsts_token
    }, ['UniqueModernGamertag', 'Gamerscore']);
    const lastPlayed = await XboxLiveAPI.getPlayerActivityHistory(xboxUID, {
        userHash: xboxAuth.user_hash,
        XSTSToken: xboxAuth.xsts_token
    }, {
        excludeTypes: "GameDVR",
        contentTypes: "Game"
    });
    const profile = {
        // @ts-ignore
        gamerTag: playerSettings.at(0).value,
        // @ts-ignore
        gamerScore: (playerSettings.at(1).value),
        lastAchievement: lastPlayed.activityItems.at(0)
    };
    return profile;
}

// module.exports = router;
