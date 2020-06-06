<script context="module">

    export async function preload(page, session) {

        let { user } = session;
        console.log("/r/[subreddit]/[listing].svelte page: " + JSON.stringify(page));
        const { subreddit } = page.params;

		if (!user) {
            console.log("/r/[subreddit]/[listing].svelte page initiating callback: " + '/authorize?callback_url='+page.path);
			return this.redirect(302, '/authorize?callback_url='+page.path);
		}
	}
</script>


<script>

    import { onMount } from 'svelte';
    import { stores } from '@sapper/app';

    const { preloading, page, session } = stores();
    console.log("/r/[subreddit]/[listing].svelte preloading: " + JSON.stringify($preloading));
    console.log("/r/[subreddit]/[listing].svelte page: " + JSON.stringify($page));
    console.log("/r/[subreddit]/[listing].svelte session: " + JSON.stringify($session));

    export let subreddit = $page.params.subreddit;
    console.log("/r/[subreddit]/[listing].svelte subreddit: " + JSON.stringify(subreddit));

    export let data;


    onMount(async () => {
        console.log("/r/[subreddit]/[listing].svelte onMount query of data");
        data = await (await fetch("/reddit/r/" + subreddit + '/top')).json();
        console.log("/r/[subreddit]/[listing].svelte onMount query " + data);
	});
</script>

<svelte:head>
	<title>/r/{ subreddit }</title>
</svelte:head>

<h1>Listings /r/{ subreddit }/top</h1>

{#if data}
    {#each data.data.children as listing, i}
        <li><a target="_blank" rel=prefetch href="/comments/{ listing.data.id }">
            {i + 1}: { listing.data.title }
        </a></li>
    {/each}
{:else}
    <p>retrieving listing from reddit api...</p>
{/if}

