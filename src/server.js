// Environment variables from .env files: https://mariosfakiolas.com/blog/manage-environment-variables-in-a-sapper-application/
require('dotenv').config();

import sirv from 'sirv';
import express from 'express';
import session from 'express-session';
import compression from 'compression';
import * as sapper from '@sapper/server';


const { PORT, NODE_ENV, REDDIT_AGENT } = process.env;
const dev = NODE_ENV === 'development';
const app = express();

async function sessionFilter(req, res, next) {
	if(typeof req.session === 'undefined') {
		req.session = { user: false, state: {} }
	}
    // console.log("/server.js:sessionFilter: " + JSON.stringify(req.session));
	next()		
}
async function urlTraceFilter(req, res, next) {
	// console.log("server.js:urlTrace url=" + req.url);
	next()		
}


// TODO: Warning The default server-side session storage, MemoryStore, is purposely not designed for a production environment. 
// It will leak memory under most conditions, does not scale past a single process, and is meant for debugging and developing.
app.use(session({
	secret: 'a random string for this application',
	resave: true,
	saveUninitialized: true
}))

// Initiates Sapper and adds the session variable to the Store.
app.use(
	compression({ threshold: 0 }),
	sirv('static', { dev }),
	urlTraceFilter,
	sessionFilter,
	sapper.middleware({
		session: (req, res) => ({
			user: req.session.user,
			token: req.session.token,
			agent: REDDIT_AGENT
		})	
	})
)


app.listen(PORT, err => {
	if (err) console.log('error', err);
});
