import graphlib from "graphlib";

// Helper to safely get a deeply nested object.
// https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
const get = (p, o) =>
  p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)


export function buildGraphFromRedditComments(rawRedditComments) {

    // quick reference http://localhost:3000/comments/gpp9le

    let root = get([0, 'data', 'children', 0, 'data'], rawRedditComments);
    let children = get([1, 'data', 'children'], rawRedditComments);

    let g = new graphlib.Graph({directed: true});
    g.setNode("root", { graphNodeType: "anchor" });

    // The root should only have one attached node.
    // console.log("I am root")
    g.setNode(root.name, root)
    g.setEdge("root", root.name)

    if(children && children instanceof Array && children.length > 0) {
        walk(g, children);
    }

    cleanGraph(g);
    // logGraph(g);
    return g;
}


function logGraph(g) {
    let jsonGraph = graphlib.json.write(g);
    console.log(JSON.stringify(jsonGraph, null, 2));
}


function walk(g, nodes) {

    // process everything on this level of the tree. Add to the replies the subcomments to process.
    let replies = [];

    nodes.forEach(node => {
        // Check for a content node
        if(node.kind != 't1') {
            return;
        }

        let children = get(['data', 'replies', 'data', 'children'], node);
        if(children && children instanceof Array && children.length > 0) {
             replies = replies.concat(children);
         }
        addGraphNode(g, node);
    });

    // recurse the replies
    if(replies.length > 0) {
        walk(g, replies)
    }
}


function addGraphNode(g, node) {
    // console.log('Adding node ' + node.data.name);
    g.setNode(node.data.name, node.data)
    let n = g.node(node.data.name)
    // console.log("Node " + JSON.stringify(n));

    // create the parent node if it doesn't exist, then attach the edge
    if(!g.hasNode(node.data.parent_id)) {
        g.setNode(node.data.parent_id);
    }
    g.setEdge(node.data.parent_id, node.data.name, node.data.created_utc)

    // create a user node if it doesn't exist, then attach the edge
    if(!g.hasNode(node.data.author_fullname)) {
        g.setNode(node.data.author_fullname,  { graphNodeType: "anchor" })
    }
    g.setEdge(node.data.author_fullname, node.data.name)

    // Generate tags
    // ups
    // length

//         // Attach the tags
//         if(node.model.tags) {
//             node.model.tags.forEach(element => {
//                 // console.log("tag " + element.type + " " + element.weight);
//                 // create the graphlib.json.write(g)Anchor node if it doesn't exist.
//                 if(!g.hasNode(element.type)) {
//                     g.setNode(element.type,  { graphNodeType: "anchor" });
//                 }
//                 g.setEdge(element.type,node.data.name, element.weight);
//             });  


//         }

    // It helps to know the number of descendents and we don't want to recalculate by analyzing the graph if we have the data at hand.
    let children = get(['data', 'replies', 'data', 'children'], node);
    if(children && children instanceof Array && children.length > 0) {
        node.data.numReplies = children.length;
    }
    else {
        node.data.numReplies = 0;
    }
}


function cleanGraph(g) {
    g.nodes().forEach(nodeName => {
        let node = g.node(nodeName);
        if(node.replies) {
            // console.log("Delete replies for node: " + nodeName);
            delete node.replies;
        }
    })
}