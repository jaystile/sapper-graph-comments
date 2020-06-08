<script>
  import { extractContent } from '../_helpers/reddit.js';
  import { onMount } from 'svelte';
  export let redditContent;
  export let active;
  let element;

  function updateActive(active) {
    if(active && element) {
      element.scrollIntoView({behavior:"smooth", block: "center", inline: "nearest"});
    }
  }

	onMount(() => {
	  updateActive(active);
	});

  $: updateActive(active);

</script>


<div bind:this={element} class="{active ? 'card border-warning mb-3' : 'card border-secondary mb-3'}"  style="max-width: 80rem;">
  <div class="card-header"><span class="badge badge-primary badge-pill">{ redditContent.ups }</span> { redditContent.created_utc } {redditContent.author}  <span class="badge badge-info badge-pill">{redditContent.numReplies}</span></div>
  <div class="card-body">
    <p class="card-text">{ extractContent(redditContent) }</p>
  </div>
</div>
