<script>
  import { extractContent } from '../_helpers/reddit.js';
  export let redditContent;
  export let active;
</script>

<div class="{active ? 'card border-warning mb-3' : 'card border-secondary mb-3'}"  style="max-width: 80rem;">
  <div class="card-header"><span class="badge badge-primary badge-pill">{ redditContent.ups }</span> { redditContent.created_utc } {redditContent.author}  <span class="badge badge-info badge-pill">{redditContent.numReplies}</span></div>
  <div class="card-body">
    <p class="card-text">{ extractContent(redditContent) }</p>
  </div>
</div>
