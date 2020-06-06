<script context="module">

    export async function preload(page, session) {

        let { user } = session;
        let identity = {}

		if (!user) {
			return this.redirect(302, '/authorize?callback_url=/user');
		}
        else {
            // console.log("/user session: " + JSON.stringify(session));
            let headers = {
                    'User-Agent': session.agent,
                    'Authorization': 'bearer ' + session.token.access_token
            }
            let resource = 'https://oauth.reddit.com/api/v1/me'
            let init = {
                method: 'GET',
                headers: headers
            }

            const res = await this.fetch(resource, init);
            let responseHeaders = res.headers;
            identity = await res.json();
        }

		return { identity };
	}
</script>

<script>
    export let identity;
</script>

<svelte:head>
	<title>User</title>
</svelte:head>

<h1>User</h1>

<p>{ JSON.stringify(identity) }</p>