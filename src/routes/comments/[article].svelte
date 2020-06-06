<script context="module">

export async function preload(page, session) {

        let { user } = session;
        let data = {}
        console.log("/comments/[article].svelte page: %s", page);
        const { article } = page.params;

		if (!user) {
            console.log("/comments/[article].svelte initiating callback: '/authorize?callback_url=%s'", page.path);
			return this.redirect(302, '/authorize?callback_url='+page.path);
		}

}
</script>

<script>

    import { stores } from '@sapper/app';
    import GraphComments from './GraphComments.svelte';
    import { buildGraphFromRedditComments } from '../_helpers/graph.js';
    const { page } = stores();
    let article = $page.params.article;

    async function getGraphData() {
        if(process.browser) { // Only run on the browser
            let url = "/reddit/comments/"+article;
            console.log("/comments/[article].svelte aquiring data: %s", url);
            let data = await (await fetch(url)).json();
            let graph = buildGraphFromRedditComments(data);
            return graph;
        }
    };
    
    let graphPromise = getGraphData();
</script>

<svelte:head>
	<title>Comments</title>
</svelte:head>

{#await graphPromise}
	<p>...acquiring data comment data from reddit</p>
{:then graph}
	<GraphComments graph={graph} />
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}


