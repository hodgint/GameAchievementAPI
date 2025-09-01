/* 

    Playstation related api.
    Get info for profile and games/trophis.

*/

var express = require('express')
var router = express.Router();

const authBaseURL = "https://ca.account.sony.com/api/authz/v3/oauth";

/* Auth functions */
async function exchangeNPSSOForAccessCode(npsso){
    var queryString = new URLSearchParams({
    access_type: "offline",
    client_id: "09515159-7237-4370-9b40-3806e67c0891",
    redirect_uri: "com.scee.psxandroid.scecompcall://redirect",
    response_type: "code",
    scope: "psn:mobile.v2.core psn:clientapp"
  }).toString();

  const requestUrl = `${authBaseURL}/authorize?${queryString}`;

  const { headers: responseHeaders } = await fetch(requestUrl, {
    headers: {
      Cookie: `npsso=${npsso}`
    },
    redirect: "manual"
  });

   if (!responseHeaders.has("location") || !responseHeaders.get("location")?.includes("?code=")) {
    throw new Error(`
      there was an issue getting an Access token. Please make sure your NPSSO is correct and valid.
      To find your NPSSO code, visit https://ca.account.sony.com/api/v1/ssocookie.
    `);
    }

  const redirectLocation = responseHeaders.get("location").toString();
  const redirectParams = new URLSearchParams(redirectLocation.split("redirect/")[1]
  );
    return redirectParams.get("code").toString();
}


async function exchangeAccessCodeForAuthToken(accessCode){
    const requestUrl = `${authBaseURL}/token`;
    const res = await fetch(requestUrl, {
        method: "POST",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
            "Basic MDk1MTUxNTktNzIzNy00MzcwLTliNDAtMzgwNmU2N2MwODkxOnVjUGprYTV0bnRCMktxc1A="
        },
        body: new URLSearchParams({
        code: accessCode,
        redirect_uri: "com.scee.psxandroid.scecompcall://redirect",
        grant_type: "authorization_code",
        token_format: "jwt"
        }).toString()
    });
  const raw = await res.json();
  return {
    accessToken: raw.access_token,
    expiresIn: raw.expires_in,
    idToken: raw.id_token,
    refreshToken: raw.refresh_token,
    refreshTokenExpiresIn: raw.refresh_token_expires_in,
    scope: raw.scope,
    tokenType: raw.token_type
  };
}

async function exchangeRefreshTokenForAuthToken(refreshToken){
    const requestUrl = `${authBaseURL}/token`;
    const res = await fetch(requestUrl, {
        method: "POST",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
            "Basic MDk1MTUxNTktNzIzNy00MzcwLTliNDAtMzgwNmU2N2MwODkxOnVjUGprYTV0bnRCMktxc1A="
        },
        body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
        token_format: "jwt",
        scope: "psn:mobile.v2.core psn:clientapp"
        }).toString()
    });

    const raw = await res.json();

    return {
        accessToken: raw.access_token,
        expiresIn: raw.expires_in,
        idToken: raw.id_token,
        refreshToken: raw.refresh_token,
        refreshTokenExpiresIn: raw.refresh_token_expires_in,
        scope: raw.scope,
        tokenType: raw.token_type
    };

}

/* trophy functions */

/* user functions */
/* The follow uses the PSN-API module * /
/**
    Notes: creates an object with the trophy counts for each type as well as the total trophies earned.
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

async function psnProfile(psnAuth, psnAccountID) {
    return {
        profile: getProfileFromAccountId({ accessToken: psnAuth.accessToken }, psnAccountID),
        links: getProfileShareableLink(psnAuth, psnAccountID),
        recent: getRecentlyPlayedGames(psnAuth, { limit: 1, categories: ["ps4_game", "ps5_native_game"] }),
        trophyCounts: trophyTypeCount(psnAuth, psnAccountID)
    }

}

router.get('/auth/:npsso', function(req,res){
    const npsso = req.params.npsso;
    console.log('NPSSO:', npsso);
    exchangeNPSSOForAccessCode(npsso)
    .then((accessCode) =>{
        if(accessCode){
            console.log('AccessCode:', accessCode)
            exchangeAccessCodeForAuthToken(accessCode)
            .then((authCode) =>{
                if(authCode){
                    res.status(200).json(authCode)
                }
            })
        }else{
            next()
        }
    })
});

router.get('/profile/:account', function(req,res){
    const auth = req.params.account.accessToken;
    const accountID = req.params.account.accountID;
    psnProfile(auth, accountID)
    .then((profile) => {
        if(profile){
            res.status(200).json(profile);
        }else{
            next();
        }
    });
});


module.exports = router;
