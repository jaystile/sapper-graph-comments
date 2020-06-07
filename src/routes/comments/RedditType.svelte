<script>

   export let redditContent;
   export let active;
   let content = "";
   let t3 = /^t3_.*$/;
   let t1 = /^t1_.*$/;

   function format(node) {
     let formattedContent = "";
     if(t3.test(node.name)) {
       formattedContent = node.title;
     }
     else if(t1.test(node.name)) {
       formattedContent = node.body;
     }
     else {
       console.log("No reddit type matcher for name:" + node.name);
     }
     return formattedContent;
   }

   $: content = format(redditContent)
   
</script>

<style>
  .active {border-style: solid;}
</style>

<div class:active={active}>
{ redditContent.ups }
{ content }
</div>