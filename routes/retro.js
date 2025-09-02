import {getUserProfile } from '@retroachievements/api';
import express from 'express';
const retroRouter = express.Router();

// function getRetroAuth(apiKey, user){
//     const auth = buildAuthorization({ webApiKey: apiKey, username: user});
//     return new Promise((resolve, reject)=>{
//         auth
//     })
// }

function getRetroUserProfile(auth, user){
    return new Promise((resolve, reject)=>{
        getUserProfile(auth, {username: user}, function(err, results){
            if(err){
                reject(err);
            }else{
                resolve(results[0])
            }
        });
    });
}

// router.get('/auth/:username', function(req, res){
//     const apiKey = req.app.locals.retroAPIKey;
//     const username = req.params.username;
//     getRetroAuth(apiKey, username)
//     .then((retroAuth) => {
//         console.log("username: " + username);
//         if(profile){
//             res.status(200).json(retroAuth);
//         }else{
//             next();
//         }
//     });
// })


retroRouter.get('/profile/:username', function(req,res){
    const username = req.params.username;
    const auth = req.app.locals.retroAuth;
    getRetroUserProfile(auth, username)
    .then((retroProffile) => {
        console.log("username: " + username);
        if(profile){
            res.status(200).json(retroAuth);
        }else{
            next();
        }    
    })
})



export default retroRouter;
