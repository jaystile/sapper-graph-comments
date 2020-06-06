
// import { DumpObjectIndented } from "../../_helpers/dumpobject.js";
import https from 'https';

export function get(req, res, next) {

    const { article } = req.params;
    // console.log("/reddit/comments/[article].js req.params: " + DumpObjectIndented(req.params));
    // console.log("/reddit/comments/[article].js req.session: " + JSON.stringify(req.session));
    // console.log("/reddit/comments/[article].js article: " + article);
    const headers = {
            'User-Agent': process.env.REDDIT_AGENT,
            'Authorization': 'bearer ' + req.session.token.access_token
    }

    let path = "/comments/" + article;
    console.log("/reddit/comments/[article].js request path: " + path);

    const options = {
        host: "oauth.reddit.com",
        port: 443,
        path: path,
        method: "GET",
        headers: headers
    };

    // Make a request to get the data
    let redditReq = https.request(options, function(redditRes) {  
        // console.log(`/reddit/comments/[article].js reddit response statusCode: ${redditRes.statusCode}`)
        // console.log(`/reddit/comments/[article].js reddit response headers: ` + DumpObjectIndented(redditRes.headers));
        
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