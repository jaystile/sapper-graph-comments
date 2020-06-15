
import https from 'https';


export function get(req, res, next) {

    const headers = {
            'User-Agent': process.env.REDDIT_AGENT,
            'Authorization': 'bearer ' + req.session.token.access_token
    }

    let path = "/api/v1/me";
    const options = {
        host: "oauth.reddit.com",
        port: 443,
        path: path,
        method: "GET",
        headers: headers
    };

    // Make a request to get the data
    let redditReq = https.request(options, function(redditRes) {  
        
        // take the response headers from reddit and pass them through.
        res.writeHead(redditRes.statusCode, {
            'Content-Length': redditRes.headers['content-length'],
            'Content-Type': redditRes.headers['content-type'] });
       
        // Read a chunk, send a chunk.
        redditRes.on('data', chunk => {
            res.write(chunk)
        });
        redditRes.on('end', () => {
            res.end();
        });
      });
    
    redditReq.on('error', function(e) {
        console.error("ERROR: ", e);
      });
    redditReq.end();
    
}