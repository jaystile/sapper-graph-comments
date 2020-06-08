<script>
  import { extractContent } from '../_helpers/reddit.js';
  import RedditListItem from './RedditListItem.svelte';
  export let states;
  let root = states[0].nodeModel;
</script>


<div class="sticky-top card  border-primary mb-3">
<div class="card-header">
  <h3>
  <span class="badge badge-primary badge-pill">{ root.ups }</span>
  {#if root.url}
    { root.url }
  {/if}
  </h3>
  
</div>
<ul class="list-group list-group-flush">
{#each states as state}
    <li class="list-group-item">{ extractContent(state.nodeModel) }</li>
{/each}
</ul>
<div class="card-footer text-muted">
  { states[0].nodeModel.permalink }
</div>
</div>