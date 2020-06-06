import https from 'https';
import { json } from 'express';


export function get(req, res, next) {

    let code=req.query.code;
    let state=Buffer.from(req.query.state, 'base64').toString('utf8')
    let sessionID = (state.split(" "))[0];
    let callback_url = (state.split(" "))[1];

    // console.log("code: " + code);
    // console.log("decoded state: " + state);
    // console.log("sessionID from state: " + sessionID);
    // console.log("callback_url from state: " + callback_url);
    // console.log("Session: " + JSON.stringify(req.session));

    if(req.sessionID === undefined || (req.sessionID != sessionID)) {
      console.error("Session id mismatch. Expected: [" + req.sessionID + "] Received: [" + sessionID + "]");
    }

    // https://github.com/reddit-archive/reddit/wiki/OAuth2#allowing-the-user-to-authorize-your-application
        
    // Exchange the code for a token
    // https://github.com/reddit-archive/reddit/wiki/OAuth2#token-retrieval-code-flow
    // Basic is base64 encoded client_id:client_secret

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic " + Buffer.from(process.env.REDDIT_CLIENT_ID + ':' + process.env.REDDIT_CLIENT_SECRET).toString('base64')
    };
    
    const options = {
        host: "www.reddit.com",
        port: 443,
        path: "/api/v1/access_token",
        method: "POST",
        headers: headers
    };

    // Make a POST request to get the access token.
    let tokenReq = https.request(options, function(tokenRes) {  
        console.log(`token request statusCode: ${tokenRes.statusCode}`)

        tokenRes.on('data', function(d) {
          let token = JSON.parse(d);
          console.log("token response: " + JSON.stringify(token));
          req.session.token = token;
          req.session.user=true;
          console.log("session: " + JSON.stringify(req.session))
          res.redirect(callback_url);
        });
      });
    
    tokenReq.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
      });
    
    tokenReq.write('grant_type=authorization_code&redirect_uri=http://localhost:3000/authorize_callback&code='+code);
    tokenReq.end();
    
}

