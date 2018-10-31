"use strict";

$('#crawl').click(function(){
  var socket = new WebSocket("ws://" + window.location.host + "/spider/echo/");
  socket.onopen = function () {
    var keyword = document.getElementById("keyword").value
    var breadth = document.getElementById("breadth").value
    var depth = document.getElementById("depth").value
    var kbd = keyword + "," + breadth + "," + depth
    socket.send(kbd);
  };

  socket.onmessage = function (e) {
    var element = document.getElementById('referencetable');
    var para = document.createElement("tr");
    var para1 = document.createElement("td");
    var para2 = document.createTextNode(e.data);
    para1.appendChild(para2);
    para.appendChild(para1);
    element.appendChild(para);

    var tc = document.getElementById('tcontent');
    tc.scrollTop = tc.scrollHeight;
  };

})
