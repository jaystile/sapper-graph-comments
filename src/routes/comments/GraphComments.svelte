<script>
   import RedditType from './RedditType.svelte';
   import { DumpObjectIndented } from '../_helpers/dumpobject.js';
   export let graph;

   let children = [];
   let childView = [];
   let childNodeName;
   let state = {
      node: undefined,
      nodeModel: undefined,
      childIndex: undefined
   };
   let previousStates = []
   let dragState
   let threshold = 200;

   function canDrill(state) {
      if(children && children.length > 0) {
         let edges = graph.outEdges(children[state.childIndex].name);
         if(edges && edges.length > 0) {
            return true;
         }
      }
      return false;
   }

   $: isPreviousDisabled = (previousStates && previousStates.length > 0) ? false : true;
   $: isDrillingDisabled = !canDrill(state);

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

   function setFocus(nodeName) {
      // console.log("Graph node count: " + graph.nodeCount() + "; edge count: " + graph.edgeCount());
      // console.debug('setFocus ' + nodeName);

      state.node = nodeName;
      state.nodeModel = graph.node(nodeName);
      children = getChildNodes(nodeName);
      setChildFocus(0);
   }

   function setChildFocus(index) {
      if(undefined == children || children.length == 0 || index < 0 || index >= children.length) {
         return; // invalid index
      }

      state.childIndex = index;
      state = state;
      // Consider: Did we want to limit the things in the view?
      // let num_previews = 3;
      // let maxIndex = Math.min(children.length, state.childIndex+num_previews);
      // childView = children.slice(state.childIndex,maxIndex)
      childView = children
   }

   function filter() {
      console.log("Filtering");
   }

   function previousChild() {
      console.log("previousChild");
      setChildFocus(state.childIndex - 1);
   }

   function nextChild() {
      // Selects the next child of the parent content
      setChildFocus(state.childIndex + 1);
   }

   function previous() {
      console.log("previous");
      if(previousStates && previousStates.length > 0) {
         let previousState = previousStates.pop();
         previousStates = previousStates;
         console.log("previous state: " + JSON.stringify(state));
         setFocus(previousState.node);
         setChildFocus(previousState.childIndex)
      }
   }

   function drill() {
      if(!canDrill(state)) {
         return;
      }
      let focus = children[state.childIndex].name;
      previousStates.push(state);
      previousStates = previousStates;
      state = {
         node: undefined,
         nodeModel: undefined,
         childIndex: undefined
      };
      setFocus(focus);

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

   // Initialize - Get the root (there should only be one neighbor)
   if(graph === undefined) {
      console.log("Graph is undefined. No work to be done.")
   }
   else {
      setFocus(graph.neighbors('root')[0]);
   }

</script>

<style>
	.grid {
		display: grid;
		grid-template-columns: auto auto auto;
		grid-template-rows: repeat(3, 3em);
	}

   .debug {
      /* visibility: visible; */
      visibility: hidden;
      display: none;
   }



</style>

<svelte:window on:keydown|preventDefault|stopPropagation={handleKeyboardEvent}/>

<div>
Graph Comments

<div>
{#each previousStates as previousState}
   <RedditType redditContent={previousState.nodeModel} />
{/each}
<RedditType redditContent={state.nodeModel} />
</div>

<div class="grid debug">
	<button on:click={filter}>filter</button>
	<button on:click={previousChild}>up</button>
	<div></div>

	<button on:click={previous} disabled={isPreviousDisabled}>previous</button>
	<div>
      { state.childIndex }
   </div>
	<button on:click={drill} disabled={isDrillingDisabled}>drill</button>

	<div></div>
	<button on:click={nextChild}>down</button>
	<div></div>
</div>
<hr />

<div id="childNodeView" on:wheel|preventDefault|stopPropagation={handleWheel}>
{#each childView as childNode, i}
   <div draggable="true" on:click={() => handleClickChild(i) } on:dragstart={handleDragstartChild} on:dragend={handleDragendChild}>
   <RedditType redditContent={childNode} active={(i == state.childIndex)} />
   </div >
{/each}
</div>
</div>
