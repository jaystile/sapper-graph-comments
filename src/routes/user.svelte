<script context="module">

    export async function preload(page, session) {

        let { user } = session;

		if (!user) {
            console.log("/user.svelte initiating callback: '/authorize?callback_url=%s'", page.path);
			return this.redirect(302, '/authorize?callback_url='+page.path);
        }

        let identity = await(await this.fetch("/reddit/api/v1/me", { credentials: 'include' })).json();
        console.log("Identity: " + JSON.stringify(identity));
        return { identity }
	}
</script>

<script>
    export let identity
</script>

<svelte:head>
	<title>User</title>
</svelte:head>

<h1>User</h1>
    <p>{ JSON.stringify(identity) }</p>
