<script>
	import StateView from './StateView.svelte';
	import RedditListItem from './RedditListItem.svelte';
   export let graph;

   let states = []
   let state
   let dragState
   let threshold = 200;

   // Initialize - Get the root (there should only be one neighbor)
   if(graph === undefined) {
      console.log("Graph is undefined. No work to be done.")
   }
   else {
      states.push(createStateForNodeName(graph.neighbors('root')[0]));
      states = states;
   }

   function createStateForNodeName(nodeName) {
      let s = {
         node: nodeName,
         nodeModel: graph.node(nodeName),
         childIndex: -1,
         children: getChildNodes(nodeName)
      };
      if(s.children.length > 0) {
         s.childIndex = 0;
      }
      return s;
   }

   function canDrill() {
      if(state && state.children && state.children.length > 0) {
         let edges = graph.outEdges(state.children[state.childIndex].name);
         if(edges && edges.length > 0) {
            return true;
         }
      }
      return false;
   }

   $: state = states[states.length-1]
   $: isPreviousDisabled = (states && states.length > 1) ? false : true;
   $: isDrillingDisabled = !canDrill();

   function getChildNodes(nodeName) {
      let edges = graph.outEdges(nodeName);
      let destinationNodes = [];
      edges.forEach(edge => {
         // v = source, if you are the source everything else is a child.
         // w = destination
         if(edge.v === nodeName) {
            // TODO: This is where we would have to do a sort based on the weight of the edge
            destinationNodes.push(graph.node(edge.w));
         }      
      });
      return destinationNodes;
   }


   function setChildFocus(index) {
      if(undefined == state.children || state.children.length == 0 || index < 0 || index >= state.children.length) {
         return; // invalid index
      }
      state.childIndex = index;
      states = states;
   }

   function filter() {
      console.log("Filtering");
   }

   function previousChild() {
      setChildFocus(state.childIndex - 1);
   }

   function nextChild() {
      setChildFocus(state.childIndex + 1);
   }

   function previous() {
      console.log("previous");
      if(states && states.length > 1) {
         states.pop();
         setChildFocus(state.childIndex)
         states = states;
      }
   }

   function drill() {
      if(!canDrill()) {
         return;
      }
      let currentState = state;
      let nextState = createStateForNodeName(currentState.children[currentState.childIndex].name);
      states.push(nextState);
      states = states;
   }

   function handleWheel(event) {
      if(event.deltaY > 0) {
         nextChild();
      }
      else if(event.deltaY < 0) {
         previousChild();
      }
      else {
         // no-op;
      }
   }


   function handleDragstartChild(event) {
      dragState = {
         screenX : event.screenX,
         screenY : event.screenY
      }
   }

   function handleDragendChild(event) {
      let deltaX = (dragState.screenX - event.screenX);
      let deltaY = (dragState.screenY - event.screenY);
      if(deltaX > threshold) {
         drill()
      }
      if(deltaX < -threshold) {
         previous()
      }
   }


   function handleKeyboardEvent(event) {
      console.log("event key: %s", event.key)
      if("ArrowUp" == event.key) {
         previousChild();
      }
      else if("ArrowDown" == event.key) {
         nextChild();
      }
      else if("ArrowLeft" == event.key) {
         previous();
      }
      else if("ArrowRight" == event.key) {
         drill();
      }
   }
   

   function handleClickChild(index) {
      setChildFocus(index);
   }

</script>

<style>

   .debug {
      /* visibility: visible; */
      visibility: hidden;
      display: none;
   }

</style>

<!-- <svelte:window on:keydown|preventDefault|stopPropagation={handleKeyboardEvent}/> -->
<svelte:window on:keydown={handleKeyboardEvent}/>

<hr />

<div class="container">
  <div class="row">
    <div class="col">
      <StateView states={states} />

      <!-- {#if (state.children.length > 2) }
      <div class="btn-group btn-group-lg btn-block" role="group" aria-label="Child Navigation Group">
      <button type="button" class="btn btn-primary">
         <svg class="bi bi-chevron-up" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
           <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"/>
         </svg>
      </button>
      <button type="button" class="btn btn-primary">
         <svg class="bi bi-chevron-down" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
         <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
         </svg>
      </button>
      </div>
      {/if} -->

      <!-- <div id="childNodeView" on:wheel|preventDefault|stopPropagation={handleWheel}> -->
      <div>
      {#each state.children as childNode, i}
         <div class="snappable" draggable="true" on:click={() => handleClickChild(i) } on:dragstart={handleDragstartChild} on:dragend={handleDragendChild}>
         <RedditListItem redditContent={childNode} active={(i == state.childIndex)} />
         </div >
      {/each}
      </div>
    </div>
  </div>
</div>

