import https from 'https';

export function get(req, res, next) {

    const { subreddit } = req.params;
    let { listing } = req.params;
    if (listing === undefined) {
        listing = 'top';
    }
    
    console.log("/reddit/[subreddit]/[listing].js req.session: ", req.session);
    console.log("/reddit/[subreddit]/[listing].js subreddit/listing: " + subreddit + '/' + listing);
    const headers = {
            'User-Agent': process.env.REDDIT_AGENT,
            'Authorization': 'bearer ' + req.session.token.access_token
    }

    let path = "/r/" + subreddit + "/" + listing;
    console.log("/reddit/[subreddit]/[listing].js request path: " + path);

    const options = {
        host: "oauth.reddit.com",
        port: 443,
        path: path,
        method: "GET",
        headers: headers
    };

    // Make a request to get the data
    let redditReq = https.request(options, function(redditRes) {  
        console.log('/reddit/[subreddit]/[listing].js reddit response statusCode: ' + redditRes.statusCode)
        console.log('/reddit/[subreddit]/[listing].js reddit response headers: ' + redditRes.headers);
        
        // take the response headers from reddit and pass them through.
        res.writeHead(redditRes.statusCode, {
            'Content-Length': redditRes.headers['content-length'],
            'Content-Type': redditRes.headers['content-type'] });
       
        // Read a chunk, send a chunk.
        redditRes.on('data', chunk => res.write(chunk));
        redditRes.on('end', () => {
            res.end();
        });
      });
    
    redditReq.on('error', function(e) {
        console.log("ERROR:");
        console.log(e);
      });
    redditReq.end();
    
}