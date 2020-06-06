import { DumpObjectIndented } from './_helpers/dumpobject.js';

export function get(req, res, next) {

    // console.log("--------------------");
    // console.log("/authorize callback request" + DumpObjectIndented(req));
    // console.log("--------------------");
    // console.log("/authorize Session: " + JSON.stringify(req.session));

    // check for session
    if (req.session.bearer_token) {
        // refresh token
        console.log("Already logged in");
    }
    else {

        let callback_url = req.query.callback_url;
        if(callback_url === undefined) {
            // add a default callback page
            callback_url = '/user'; 
        }

        // base64 encode the sessionId and callback_url as the state.
        let state =  req.sessionID + ' ' + callback_url;
        console.log('state: ' + state);
        state = Buffer.from(state).toString('base64')

        // Redirect to external site for authorization
        // https://github.com/reddit-archive/reddit/wiki/OAuth2#authorization
        // console.log("Redirecting to Reddit authentication")
        res.append("User-Agent", process.env.REDDIT_AGENT);
        console.log('/authorize REDDIT_CLIENT_ID: ' + process.env.REDDIT_CLIENT_ID);
        let url = 'https://www.reddit.com/api/v1/authorize?client_id='+process.env.REDDIT_CLIENT_ID+'&response_type=code&state='+state+'&redirect_uri=http://localhost:3000/authorize_callback&duration=permanent&scope=identity read';
        console.log(url);
        res.redirect(307, url);
    }

}