"use strict";
var nodes;
var edges;

var currentnetworktype = "None" //"ReferenceNetwork", "AuthorNetwork"
var network = null;
var options = {
  height: '100%',

  width: '100%',

  physics:{
    enabled:true,
    barnesHut: {
      centralGravity: 0.5,
      damping: 0.3,
    },
    timestep: 0.3,
  },

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


function showReferenceInfoCard(params) {
  document.getElementsByClassName("choose1")[0].innerHTML = "Basic";
  document.getElementsByClassName("choose2")[0].innerHTML = "Detailed";
  document.getElementsByClassName("choose3")[0].innerHTML = "Abstract";

  var infocard = $(".infocard");
  var node = nodes["_data"][params.nodes[0]];
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

function showAuthorNodeInfoCard(params) {
  document.getElementsByClassName("choose1")[0].innerHTML = "Author";
  document.getElementsByClassName("choose2")[0].innerHTML = "INST";
  document.getElementsByClassName("choose3")[0].innerHTML = "Info";

  var infocard = $(".infocard");
  var node = nodes["_data"][params.nodes[0]];
  var first = document.getElementById("first");
  var second = document.getElementById("second");
  var third = document.getElementById("third");

  first.innerHTML = "";
  second.innerHTML = "";
  third.innerHTML = "";

  var p = document.createElement("p");
  p.innerText = node["authorid"]
  first.appendChild(p)

  var p = document.createElement("p");
  p.innerText = node["authorname"];
  first.appendChild(p);

  var p = document.createElement("p");
  p.innerText = node["organizationid"];
  second.appendChild(p);

  var p = document.createElement("p");
  p.innerText = node["organizationname"];
  second.appendChild(p);

  infocard.fadeIn("500");
  infocard.removeClass("hidden");
}

function showAuthorEdgeInfoCard(params) {
  var selectednodes = network.getSelectedNodes()
  if (selectednodes.length === 0) {
    document.getElementsByClassName("choose1")[0].innerHTML = "From";
    document.getElementsByClassName("choose2")[0].innerHTML = "To";
    document.getElementsByClassName("choose3")[0].innerHTML = "Info";

    var infocard = $(".infocard");
    var edge = edges["_data"][params.edges[0]];
    var first = document.getElementById("first");
    var second = document.getElementById("second");
    var third = document.getElementById("third");

    first.innerHTML = "";
    second.innerHTML = "";
    third.innerHTML = "";

    var p = document.createElement("p");
    p.innerText = edge["from"]
    first.appendChild(p)

    var p = document.createElement("p");
    p.innerText = edge["refer"]
    first.appendChild(p)

    var p = document.createElement("p");
    p.innerText = edge["to"]
    second.appendChild(p)

    var p = document.createElement("p");
    p.innerText = edge["cited"]
    second.appendChild(p)

    infocard.fadeIn("500");
    infocard.removeClass("hidden");
  }
}

function hideInfoCard() {
  var infocard = $(".infocard");
  infocard.fadeOut("500");
  infocard.addClass("hidden");
}


function getReferenceNetworkData(nodelist, edgelist) {
  var nodesArray = [];
  var edgesArray = [];

  for(var i in nodelist) {
    var node = {
        id: i,
        selfid: nodelist[i]["selfid"],
        url: nodelist[i]["url"],
        title: nodelist[i]["title"],
        authors: nodelist[i]["authors"],
        abstract: nodelist[i]["abstract"],
        referids: nodelist[i]["referids"],
        weight: nodelist[i]["weight"],
        communities: nodelist[i]["communities"],
        year: nodelist[i]["year"],
        doi: nodelist[i]["doi"],
        publication: nodelist[i]["publication"],
        fields: nodelist[i]["fields"],
        sources: nodelist[i]["sources"],

        size: 15 + nodelist[i]["weight"]*20,
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

  nodes = new vis.DataSet(nodesArray);
  edges = new vis.DataSet(edgesArray);

  return {
    nodes: nodes,
    edges: edges
  };
}

function getAuthorNetworkData(nodelist, edgelist) {
  var nodesArray = [];
  var edgesArray = [];

  for(var i in nodelist) {
    var node = {
        id: i,
        title: nodelist[i]["authorname"],
        authorid: nodelist[i]["authorid"],
        authorname: nodelist[i]["authorname"],
        organizationid: nodelist[i]["organization"]["organizationid"],
        organizationname: nodelist[i]["organization"]["organizationname"],
        weight: nodelist[i]["weight"],
        communities: nodelist[i]["communities"],

        size: 10 + nodelist[i]["weight"]*10,
    };
    nodesArray.push(node);
  }

  for (var i in edgelist) {
    if (edgelist[i]["from"] === "" || edgelist[i]["to"] === "") {
      continue;
    }
    var edge = {
      title: edgelist[i]["relation"]["refer"]["title"] + "->" + edgelist[i]["relation"]["cited"]["title"],
      from: edgelist[i]["from"],
      to: edgelist[i]["to"],
      refer: edgelist[i]["relation"]["refer"]["title"],
      cited: edgelist[i]["relation"]["cited"]["title"],
    };
    edgesArray.push(edge);
  }

  nodes = new vis.DataSet(nodesArray);
  edges = new vis.DataSet(edgesArray);

  return {
    nodes: nodes,
    edges: edges
  };
}


function drawReferenceNetwork(data) {
  var loadingBar = $("#loadingBar");
  loadingBar.removeClass("hidden");

  if (network !== null) {
    network.destroy();
  }

  var container = document.getElementById("network");
  network = new vis.Network(container, data, options);
  currentnetworktype = "ReferenceNetwork";

  network.on("selectNode", showReferenceInfoCard);
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

    network.stopSimulation();
  });
}

function drawAuthorNetwork(data) {
  var loadingBar = $("#loadingBar");
  loadingBar.removeClass("hidden");

  if (network !== null) {
    network.destroy();
  }

  var container = document.getElementById("network");
  network = new vis.Network(container, data, options);
  currentnetworktype = "AuthorNetwork";

  network.on("selectEdge", showAuthorEdgeInfoCard);
  network.on("deselectEdge", hideInfoCard);
  network.on("selectNode", showAuthorNodeInfoCard);
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

    network.stopSimulation();
  });
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


function focusNode(id) {
  var options={
    scale: 1,
    animation: {
      duration: 800,
      easingFunction: 'easeInQuad'
    }
  }
  network.focus(id, options);

  var ids = new Array()
  ids[0] = id
  network.selectNodes(ids);
  setTimeout(function(){ network.unselectAll(); }, 1500);
}

function showRanklist(ranklist) {
  var header = document.getElementById("rankheader");
  var content = document.getElementById("rankcontent");

  while(header.hasChildNodes()) {
    header.removeChild(header.firstChild);
  }

  while(content.hasChildNodes()) {
    content.removeChild(content.firstChild);
  }

  var tr = document.createElement("tr");
  var th0 = document.createElement("th");
  var th1 = document.createElement("th");
  var th2 = document.createElement("th");
  th0.innerText = "Rank";
  th0.setAttribute("width", "10%");
  th1.innerText = "Node";
  th1.setAttribute("width", "70%");
  th2.innerText = "Weight";
  th2.setAttribute("width", "20%");
  tr.appendChild(th0);
  tr.appendChild(th1);
  tr.appendChild(th2);
  header.appendChild(tr);

  var num = 0;
  for (var i in ranklist) {
    var id = ranklist[i][0];
    var value = String(ranklist[i][1]).substring(0, 5);
    var name = nodes['_data'][id]['title'];
    num += 1;

    var tr = document.createElement("tr");
    var td0 = document.createElement("td");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");

    td0.innerText = num;
    td1.setAttribute("width", "10%");
    td1.innerText = name;
    td1.setAttribute("width", "70%");
    td2.innerText = value;
    td2.setAttribute("width", "20%");

    tr.appendChild(td0);
    tr.appendChild(td1);
    tr.appendChild(td2);

    var click = 'focusNode('+id+')';
    tr.setAttribute('onClick',click);

    content.appendChild(tr);
  }
}


$("#reference-network").click(function(){
  $.ajax({
    url: "referencenetwork",
    type: "GET",
    success:function(message){
      var nodelist = message["nodelist"];
      var edgelist = message["edgelist"];
      var ranklist = message["ranklist"];

      var data = getReferenceNetworkData(nodelist, edgelist);

      document.getElementById('nodenum').innerHTML = 'node: '+ nodes.length;
      document.getElementById('edgenum').innerHTML = 'edge: '+ edges.length;

      drawReferenceNetwork(data);

      showRanklist(ranklist);
    }
  })
})


$("#author-network").click(function(){
  $.ajax({
    url: "authornetwork",
    type: "GET",
    success:function(message){
      var nodelist = message["nodelist"];
      var edgelist = message["edgelist"];
      var ranklist = message["ranklist"];

      var data = getAuthorNetworkData(nodelist, edgelist);
      document.getElementById('nodenum').innerHTML = 'node: '+ nodes.length;
      document.getElementById('edgenum').innerHTML = 'edge: '+ edges.length;

      drawAuthorNetwork(data);

      showRanklist(ranklist);
    }
  })
})


$("#kclique").click(function(){
  document.getElementById('loadingBar').style.display = '';
  document.getElementById('loadingBar').style.opacity = 1;
  document.getElementById('bar').innerHTML = "Waiting for rendering...";
  document.getElementById('text').innerHTML = "";

  $.ajax({
    url: "kclique",
    type: "GET",
    data: {
      "kd" : document.getElementById("kdata").value,
      "networktype": currentnetworktype
    },
    success:function(communities){
      if (currentnetworktype !== "None") {
        dyeNetwork(communities);
      }

      document.getElementById('loadingBar').style.opacity = 0;
      document.getElementById('bar').innerHTML = "";
      setTimeout(function () {document.getElementById('loadingBar').style.display = 'none';}, 500);
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
