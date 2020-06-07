<script>
	import Nav from '../components/Nav.svelte';

	export let segment;
</script>


<style lang="scss" global>
  @import "bootswatch/dist/darkly/variables";
  @import "bootstrap/scss/bootstrap";
  @import "bootswatch/dist/darkly/bootswatch";  
</style>

<Nav {segment}/>

<main class="container">
	<slot></slot>
</main>