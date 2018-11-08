# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from django.http import JsonResponse

from network import ReferenceNetwork, AuthorNetwork

import json

# Create your views here.

referencenetwork = None
authornetwork = None


def network(request):
    return render(request, 'network/network.html')


def getreferencenetwork(request):
    global referencenetwork
    referencenetwork = ReferenceNetwork()
    referencenetwork.generateNetwork()

    ranklist = referencenetwork.rankNode()

    graph = referencenetwork.graph
    nodes = dict(graph.nodes)
    edges = {i: {'from': e[0], 'to': e[1]} for i,e in enumerate(graph.edges)}
    return JsonResponse({
        'nodelist': nodes,
        'edgelist': edges,
        'ranklist': ranklist
        },
        safe=False)


def getauthornetwork(request):
    global authornetwork
    authornetwork = AuthorNetwork()
    authornetwork.generateNetwork()

    ranklist = authornetwork.rankNode()

    graph = authornetwork.graph
    nodes = dict(graph.nodes)
    edges = {i: {'from':e[0], 'to':e[1],'relation':graph.edges[e[0],e[1],e[2]]['relation']} for i,e in enumerate(graph.edges)}
    return JsonResponse({
        'nodelist':nodes,
        'edgelist':edges,
        'ranklist': ranklist
        },
        safe=False)


def kclique(request):
    k = request.GET.get('kd')
    k = int(k) if k != '' else 0
    networktype = request.GET.get('networktype')

    if networktype == 'None':
        communities = []

    if networktype == 'ReferenceNetwork':
        global rerferencenetwork
        communities = referencenetwork.executeKClique(k)

    if networktype == 'AuthorNetwork':
        global authornetwork
        communities = authornetwork.executeKClique(k)

    return JsonResponse(communities, safe=False)
