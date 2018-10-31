# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from django.http import JsonResponse

from network import ReferenceNetwork

import json

# Create your views here.

rerferencenetwork = None

def network(request):
    global rerferencenetwork
    rerferencenetwork = ReferenceNetwork()
    rerferencenetwork.generateNetwork()

    rank = rerferencenetwork.executePageRank()

    graph = rerferencenetwork.graph
    nodes = dict(graph.nodes)
    edges = {i: {'from': e[0], 'to': e[1]} for i,e in enumerate(graph.edges)}

    return render(request, 'network/network.html',
         context={
         'nodelist': json.dumps(nodes),
         'edgelist': json.dumps(edges),
         'ranklist': json.dumps(rank)
         })

def kclique(request):
    k = int(request.GET.get('kd'))
    global rerferencenetwork
    communities = rerferencenetwork.executeKClique(k)
    return JsonResponse(communities, safe=False)
