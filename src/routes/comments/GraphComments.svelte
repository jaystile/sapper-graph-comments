<script>
	import StateView from './StateView.svelte';
	import RedditListItem from './RedditListItem.svelte';
   export let graph;

   let states = []
   let dragState
   let threshold = 200;

   function createStateForNodeName(nodeName) {
      let state = {
         node: nodeName,
         nodeModel: graph.node(nodeName),
         childIndex: -1,
         children: getChildNodes(nodeName)
      };
      if(state.children.length > 0) {
         state.childIndex = 0;
      }

      return state;
   }

   function canDrill() {
      let state = states[states.length-1]
      if(state.children && state.children.length > 0) {
         let edges = graph.outEdges(state.children[state.childIndex].name);
         if(edges && edges.length > 0) {
            return true;
         }
      }
      return false;
   }

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
      let state = states[states.length-1];
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
      setChildFocus(states[states.length-1].childIndex - 1);
   }

   function nextChild() {
      setChildFocus(states[states.length-1].childIndex + 1);
   }

   function previous() {
      console.log("previous");
      if(states && states.length > 1) {
         states.pop();
         setChildFocus(states[states.length-1].childIndex)
         states = states;
      }
   }

   function drill() {
      if(!canDrill()) {
         return;
      }
      let currentState = states[states.length-1];
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

   // Initialize - Get the root (there should only be one neighbor)
   if(graph === undefined) {
      console.log("Graph is undefined. No work to be done.")
   }
   else {
      states.push(createStateForNodeName(graph.neighbors('root')[0]));
      states = states;
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



<div class="grid debug">
	<button on:click={filter}>filter</button>
	<button on:click={previousChild}>up</button>
	<div></div>

	<button on:click={previous} disabled={isPreviousDisabled}>previous</button>
	<div>
      { states[states.length-1].childIndex }
   </div>
	<button on:click={drill} disabled={isDrillingDisabled}>drill</button>

	<div></div>
	<button on:click={nextChild}>down</button>
	<div></div>
</div>

<hr />

<div class="container">
  <div class="row">
    <div class="col">
      <StateView states={states} />
    </div>

    <div class="col">
      <div id="childNodeView" on:wheel|preventDefault|stopPropagation={handleWheel}>
      {#each states[states.length-1].children as childNode, i}
         <div draggable="true" on:click={() => handleClickChild(i) } on:dragstart={handleDragstartChild} on:dragend={handleDragendChild}>
         <RedditListItem redditContent={childNode} active={(i == states[states.length-1].childIndex)} />
         </div >
      {/each}
      </div>
    </div>
  </div>
</div>

