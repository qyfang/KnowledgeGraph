"use strict";
var nodes;
var edges;
var network = null;
var options = {
  height: '100%',

  width: '100%',

  interaction: {
    tooltipDelay: 100,
    hover: true
  },

  layout: {
    improvedLayout: false,
    hierarchical: {
      enabled:false,
      treeSpacing: 30,
      nodeSpacing: 30,
    }
  },

  nodes: {
    size: 15,
    mass: 2,
    shape: 'dot',
    color: {
      background: '#282A36',
      border: 'rgba(255,255,255, .85)',
    },
    font: {
        face: 'Roboto',
        size: 5
      },
    borderWidth: 1
  },

  edges: {
    color: {
      color: '#FFFFFF',
      highlight: '#FFFFFF',
      hover: '#FFFFFF'
    },
    width: 0.3,
    hoverWidth: 0.3,
    smooth: {
      type:'continuous'//dynamic,continuous
    },
    smooth: false,
    arrows: {
      to: {
        enabled: true,
        scaleFactor: 0.3,
        type: 'arrow'
      }
    }
  }
};
var data = getNetworkData();

function getNetworkData() {
  var nodesArray = [];
  var edgesArray = [];

  for(var i in nodelist) {
    var node = {
        id: i,
        url: nodelist[i]["url"],
        title: nodelist[i]["title"],
        authors: nodelist[i]["authors"],
        abstract: nodelist[i]["abstract"],
        referids: nodelist[i]["referids"],
        weight: nodelist[i]["weight"],
        communities: nodelist[i]["communities"],

        size: 15 + nodelist[i]["weight"]*20
    };
    nodesArray.push(node);
  }

  for (var i in edgelist) {
    if (edgelist[i]["from"] === "" || edgelist[i]["to"] === "") {
      continue;
    }
    var edge = {
      from: edgelist[i]["from"],
      to: edgelist[i]["to"]
    };
    edgesArray.push(edge);
  }

  // for (var i in nodelist) {
  //   var from = i;
  //   for (var j in nodelist[i]["referids"]){
  //     var to = nodelist[i]["referids"][j];
  //     if (from === "" || to === "") {
  //       continue;
  //     }
  //     var edge = {
  //       from: from,
  //       to: to
  //     };
  //     edgesArray.push(edge);
  //   }
  // }

  nodes = new vis.DataSet(nodesArray);
  edges = new vis.DataSet(edgesArray);

  return {
    nodes: nodes,
    edges: edges
  };
}

function drawNetwork() {
  if (network !== null) {
    network.destroy();
  }

  var container = document.getElementById("network");
  network = new vis.Network(container, data, options);

  network.on("selectNode", showInfoCard);
  network.on("deselectNode", hideInfoCard);
  network.on("stabilizationProgress", function(params) {
    document.getElementById('loadingBar').style.display = '';
    document.getElementById('loadingBar').style.opacity = 1;
    var maxWidth = 496;
    var minWidth = 20;
    var widthFactor = params.iterations/params.total;
    var width = Math.max(minWidth,maxWidth * widthFactor);
    document.getElementById('bar').style.width = width + 'px';
    document.getElementById('text').innerHTML = Math.round(widthFactor*100) + '%';
  });
  network.once("stabilizationIterationsDone", function() {
    document.getElementById('text').innerHTML = '100%';
    document.getElementById('bar').style.width = '496px';
    document.getElementById('loadingBar').style.opacity = 0;
    setTimeout(function () {document.getElementById('loadingBar').style.display = 'none';}, 500);
  });
}

function showInfoCard(params) {
  var infocard = $(".infocard");
  var node = nodelist[params.nodes[0]];
  var first = document.getElementById("first");
  var second = document.getElementById("second");
  var third = document.getElementById("third");

  first.innerHTML = "";
  second.innerHTML = "";
  third.innerHTML = "";

  var p = document.createElement("p");
  p.innerText = node["selfid"]
  first.appendChild(p)

  p = document.createElement("p");
  p.innerText = node["title"]
  first.appendChild(p)

  var str="";
  for(var i in node["authors"]){
    if (i == node["authors"].length - 1) str += node["authors"][i]["authorname"]
    else str += node["authors"][i]["authorname"] + ", "
  }
  p = document.createElement("p");
  p.innerText = str
  first.appendChild(p)

  p = document.createElement("p");
  p.innerText = node["doi"]
  first.appendChild(p)

  p = document.createElement("p");
  p.innerText = node["year"]
  second.appendChild(p)

  p = document.createElement("p");
  p.innerText = node["publication"]
  second.appendChild(p)

  p = document.createElement("p");
  for(var i in node["fields"]){
    if (i == node["fields"].length - 1) str += node["fields"][i]["fieldname"]
    else str += node["fields"][i]["fieldname"] + ", "
  }
  p.innerText = str
  second.appendChild(p)

  p = document.createElement("p");
  p.innerText = node["abstract"]
  third.appendChild(p)

  infocard.fadeIn("500");
  infocard.removeClass("hidden");
}

function hideInfoCard() {
  var infocard = $(".infocard");
  infocard.fadeOut("500");
  infocard.addClass("hidden");
}

function dyeNetwork(group) {
  var palette = [
  '#a82b2b', '#3e23a0', '#f7d2d2', '#f7de02', '#6aff00',
  '#23a074', '#237da0', '#023944', '#57a023', '#b7a92c',
  '#f98989', '#556B2F', '#FFA500', '#8B4513', '#4B0082',
  '#5F9EA0', '#00BFFF', '#D2B48C', '#800000', '#FAFAD2'
  ];

  for (var i in nodes["_data"]) {
      nodes.update([{id:i, color:{background:"#282A36"}}]);
  }

  for (var i in edges["_data"]) {
    edges.update([{
      id:i,
      color:{color:"#FFFFFF",highlight:"#FFFFFF",hover:"#FFFFFF"}
    }]);
  }

  for (var i in group) {
    for (var j in group[i]) {
      nodes.update([{id:group[i][j], color:{background: palette[i]}}]);
    }
  }

  for (var i in edges["_data"]) {
    for(var j in group){
      if (group[j].indexOf(edges["_data"][i]["from"]) !== -1 && group[j].indexOf(edges["_data"][i]["to"]) !== -1) {
        edges.update([{
          id: edges["_data"][i]["id"],
          color: {color:palette[j],highlight:palette[j],hover:palette[j]}
        }]);
        break;
      }
    }
  }
}

$("#kclique").click(function(){
  $.ajax({
    url: "kclique",
    type: "GET",
    data: {"kd" : document.getElementById("kdata").value},
    success:function(communities){
      dyeNetwork(communities)
    }

  })
})

$("#reset").click(function(){
  for (var i in nodes["_data"]) {
    nodes.update([{id:i,color:{background:"#282A36"}}]);
  }

  for (var i in edges["_data"]) {
    edges.update([{
      id: i,
      color: {color:"#FFFFFF",highlight:"#FFFFFF",hover:"#FFFFFF"}
    }]);
  }
})

$("#layout-tree").click(function(){
  options["layout"]["hierarchical"]["enabled"] = true;
  drawNetwork()
})

$("#layout-network").click(function(){
  options["layout"]["hierarchical"]["enabled"] = false;
  drawNetwork()
})

drawNetwork();
document.getElementById('nodenum').innerHTML = 'node: '+ nodes.length;
document.getElementById('edgenum').innerHTML = 'edge: '+ edges.length;
