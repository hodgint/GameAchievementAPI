/* 

    Playstation related api.
    Get info for profile and games/trophis.

*/
// import { validateHeaders } from './middlewares/validators.js';

import express from 'express';
const psnRouter = express.Router();

const authBaseURL = "https://ca.account.sony.com/api/authz/v3/oauth";
const userBaseURL = "https://m.np.playstation.com/api/userProfile/v1/internal/users";
const gameBaseURL = "https://m.np.playstation.com/api/gamelist/v2/users";
const trophyBaseURL = "https://m.np.playstation.com/api/trophy/v1/users";

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


async function getUsersPSNGames(psnAuth, accountID){
    const requestUrl = `${gameBaseURL}/${accountID}/titles`
    // console.log("reqURL: ", requestUrl);
    // console.log("psnAuth: ", psnAuth);
    const res = await fetch(requestUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${psnAuth}`,
            "Content-Type": "application/json"
        }
    });
    console.log("game response:", res);
    return res;
}

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
    const requestUrl = `${userBaseURL}/${psnAccountID}/profiles`;

     const response = await fetch(requestUrl, {
        headers: {
            authorization: psnAuth
        }
     });

    if ((response)?.error) {
        throw new Error((response)?.error?.message ?? "Unexpected Error");
    }
    return response;
}

psnRouter.get('/auth/:npsso', function(req,res){
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

psnRouter.get('/profile/:accountID', function(req,res){
    const auth = req.headers.authorization;
    const accountID = req.params.accountID;
    getUsersPSNGames(auth, accountID)
    .then((profile) => {
        if(profile && profile.status != "401"){
            console.log(profile);
            res.status(200).json(profile);
        }else{
            res.status(profile.status).json(profile.statusText);
        }
    });
});

export default psnRouter;
