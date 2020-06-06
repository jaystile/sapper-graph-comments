<script context="module">

    export async function preload(page, session) {

        let { user } = session;
        let data = {}

		if (!user) {
			return this.redirect(302, '/authorize?callback_url=/top');
		}
        else {
            // console.log("/user session: " + JSON.stringify(session));
            let headers = {
                    'User-Agent': session.agent,
                    'Authorization': 'bearer ' + session.token.access_token
            }
            let resource = 'https://oauth.reddit.com/r/programming'
            let init = {
                method: 'GET',
                headers: headers
            }

            const res = await this.fetch(resource, init);
            let responseHeaders = res.headers;
            // Log the headers, see the rate limiting response headers:
            // x-ratelimit-remaining
            // x-ratelimit-reset
            // x-ratelimit-used
            // for (var pair of responseHeaders.entries()) {
            //     console.log(pair[0]+ ': '+ pair[1]);
            // }
            data = await res.json();
        }

		return { data };
	}
</script>

<script>
    export let data;
</script>

<svelte:head>
	<title>/r/programming/top</title>
</svelte:head>

<h1>Listings /r/programming/top</h1>

{#each data.data.children as listing, i}
    
    <li><a target="_blank" href="{ listing.data.permalink }">
        {i + 1}: { listing.data.title }
    </a></li>
{/each}