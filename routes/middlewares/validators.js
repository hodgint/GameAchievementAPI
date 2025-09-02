/* 
middleware and schemas for validating various sensitive information
Authentication schema's will be different for each platform.
*/
export const psnAuthSchema = {
    accessToken: {required: true},
    expiresIn: {required: true},
    idToken: {required: true},
    refreshToken: {required: true},
    refreshTokenExpiresIn: {required: true},
    scope: {required: true},
    tokenType: {required: true}
}

export const retroAuthSchema = {}
export const steamAuthSchema = {}
export const xboxAuthSchema = {}


function validatePSNAuth(psnAuth){
        
}

function validateRetroAuth(retroAuth){
        
}

function validateSteamAuth(steamAuth){
        
}


function validateXboxAuth(xboxAuth){
        
}


export function validateHeaders(req, res, next) {
/* make sure we have an auth token in the header */
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No auth token sent!' });
    }
    next();
};


