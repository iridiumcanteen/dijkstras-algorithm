// Data definitions
var nodes = [
    {id: "a", name:"a",visited:false,journeyCost:-1},
    {id: "a", name:"b",visited:false,journeyCost:-1},
    {id: "a", name:"c",visited:false,journeyCost:-1},
    {id: "a", name:"d",visited:false,journeyCost:-1},
    {id: "a", name:"e",visited:false,journeyCost:-1}
];
var links = [
    {source:"a",target:"b",cost:2}, 
    {source:"a",target:"c",cost:4},
    {source:"b",target:"c",cost:1},
    {source:"b",target:"d",cost:8},
    {source:"c",target:"d",cost:4},
    {source:"d",target:"e",cost:1}
];

var startName = "a";
var endName = "e";

// -------------------------
// Set the start node's journey cost to 0 - this initialises it as the start node
// Then starting at start node, recursively do the following
// 1. Set start node as 'visited'
// 2. Calculate the journeyCost to each 'unvisited' neighbour
// 3. Check if any of the unvisited neighbours are the end node
// 4a. If end node located, end recursion
// 4b. If end node not located, select the cheapest neighbour and make them the new 'start node'
// 5. Recurse
// 6. From the end node, walk backwards by selecting the cheapest visited neighbour of each successive node

var startNode = nodes[getNodeRef(startName)];
var endNode = nodes[getNodeRef(endName)];

startNode.journeyCost = 0;
if(recursivelyCalculateJourneys(startName)) {
    var path = getCheapestPath();
    var pathNames = [];
    for(var counter = 0; counter < path.length; counter++) {
        pathNames[counter] = path[counter].name;
    }
    console.log("Cheapest path is " + pathNames + " at cost of " + endNode.journeyCost);
} else {
    console.log("No route found from " + startName + " to " + endName);
}
console.log(nodes);

//Utility functions
function getLinkRef(startName,endName) {
    var counter = 0;
    for(let link of links) {
        var startMatch = false;
        var endMatch = false;
        if(link.source == startName && link.target == endName) {
            return counter;
        }
        if(link.source == endName && link.target == startName) {
            return counter;
        }
        counter++;
    }
    return -1;
}

function getNodeRef(nodeName){
    var counter = 0;
    for(let node of nodes) {
        if(node.name == nodeName) {
            return counter;
        }
        counter++;
    }
    return -1;
}

function getNeighboursNames(nodeName) {
    var neighbours = [];
    var neighboursCount = 0;
    for(let link of links) {
        if(link.source == nodeName) {
            neighbours[neighboursCount] = link.target;
            neighboursCount++;
        }
        if(link.target == nodeName) {
            neighbours[neighboursCount] = link.source;
            neighboursCount++;
        }
    }
    return neighbours;
}

// Working functions
function recursivelyCalculateJourneys(nodeName) {
    // 1. Set start node as 'visited'
    // 2. Calculate the journeyCost to each 'unvisited' neighbour
    // 3. Check if any of the unvisited neighbours are the end node
    // 4a. If end node located, end recursion
    // 4b. If end node not located, select the cheapest neighbour and make them the new 'start node'
    // 5. Recurse
    var node = nodes[getNodeRef(nodeName)];

    node.visited = true;

    var neighboursNames = getNeighboursNames(nodeName);
    
    calculateUnvisitedNeighbourJourneys(node,neighboursNames);

    for(let neighbourName of neighboursNames) {
        if(neighbourName == endName) {
            // End of recursion
            return true;
        }
    }

    var unvisitedNeighboursByCost = getUnvisitedNeighboursByCost(nodeName); 
    for(let unvisitedNeighbour of unvisitedNeighboursByCost) {
        if(recursivelyCalculateJourneys(unvisitedNeighbour.name)) {
            return true;
        }
    }

    return false;
}

function calculateUnvisitedNeighbourJourneys(node, neighboursNames) {
    for(let neighboursName of neighboursNames) {
        var neighbourRef = getNodeRef(neighboursName);
        if(!nodes[neighbourRef].visited) {
            var linkRef = getLinkRef(node.name, neighboursName);
            if(nodes[neighbourRef].journeyCost > node.journeyCost + links[linkRef].cost || nodes[neighbourRef].journeyCost == -1) {
                nodes[neighbourRef].journeyCost = node.journeyCost + links[linkRef].cost;
            }
        }
    }
}

function getUnvisitedNeighboursByCost(nodeName) {
    var neighboursNames = getNeighboursNames(nodeName);
    var sortedNeighbours = [];

    for(let neighboursName of neighboursNames) {
        var neighbour = nodes[getNodeRef(neighboursName)];
        if(!neighbour.visited) {
            if(sortedNeighbours.length == 0) {
                sortedNeighbours[0] = neighbour;
            } else {
                var sortedNeighboursIndex = 0;
                var added = false
                for(let sortedNeighbour of sortedNeighbours) {
                    if(neighbour.journeyCost < sortedNeighbour.journeyCost) {
                        sortedNeighbours.splice(sortedNeighboursIndex, 0, neighbour);
                        added = true;
                        break;
                    }
                    sortedNeighboursIndex++;
                }
                if(!added) {
                    sortedNeighbours[sortedNeighboursIndex] = neighbour;
                }
            }
        }
    }
    
    return sortedNeighbours;
}

function getCheapestNeighbour(node) {
    var neighboursNames = getNeighboursNames(node.name);
    var neighbour;
    var link;

    var cheapestNeighbour = nodes[getNodeRef(neighboursNames[0])];
    var cheapestNeighbourLink = links[getLinkRef(neighboursNames[0], node.name)];
    for(let neighbourName of neighboursNames) {
        neighbour = nodes[getNodeRef(neighbourName)];
        if(neighbour.visited) {
            link = links[getLinkRef(neighbourName, node.name)];
            // This cost is the cost to that node, plus the cost of travelling the link from that node to this one
            if((neighbour.journeyCost + link.cost) < (cheapestNeighbour.journeyCost + cheapestNeighbourLink.cost)) {
                cheapestNeighbour = neighbour;
                cheapestNeighbourLink = link;
            }
        }
    }
    return cheapestNeighbour;
}

function getCheapestPath() {
    var navNode = endNode;
    var path = [navNode];
    while(navNode.name != startName) {
        navNode = getCheapestNeighbour(navNode);
        path.splice(0,0,navNode);
    }
    return path;
}

