# -*- coding: UTF-8 -*-
import networkx as nx

from networkx.algorithms.community import k_clique_communities

from networkx.algorithms.link_analysis.pagerank_alg import pagerank_numpy

from data.data import getReferenceData, getReferenceDataById


class Network(object):
    def __init__(self):
        self.graph = None

    def generateNode(self):
        pass

    def generateEdge(self):
        pass

    def generateNetwork(self):
        self.generateNode()
        self.generateEdge()

    def executeKClique(self, k):
        if k < 2:
            return []

        udgraph = self.graph.to_undirected()
        communities = k_clique_communities(udgraph, k)
        nodes = self.graph.node
        communitynum = -1

        for n in nodes:
            nodes[n]['communities'] = []

        coms = {}
        for community in communities:
            communitynum += 1
            com = []
            for n in community:
                nodes[n]['communities'].append(communitynum)
                com.append(n)
            coms[communitynum] = com
        return coms

    def executePageRank(self):
        pr = pagerank_numpy(self.graph)
        maxpr = max(pr.values())
        minpr = min(pr.values())
        nodes = self.graph.node

        for n in nodes:
            nodes[n]['weight'] = (pr[n] - minpr) / (maxpr - minpr)

        rank = sorted(pr.items(), lambda x, y: cmp(x[1], y[1]), reverse=True)

        return rank


class ReferenceNetwork(Network):
    def __init__(self):
        super(ReferenceNetwork, self).__init__()
        self.graph = nx.DiGraph()

        nx.set_node_attributes(self.graph, '', 'selfid')
        nx.set_node_attributes(self.graph, '', 'url')
        nx.set_node_attributes(self.graph, '', 'title')
        nx.set_node_attributes(self.graph, [], 'authors')
        nx.set_node_attributes(self.graph, '', 'abstract')
        nx.set_node_attributes(self.graph, '', 'year')
        nx.set_node_attributes(self.graph, '', 'doi')
        nx.set_node_attributes(self.graph, '', 'publication')
        nx.set_node_attributes(self.graph, [], 'sources')
        nx.set_node_attributes(self.graph, [], 'fields')
        nx.set_node_attributes(self.graph, [], 'referids')
        nx.set_node_attributes(self.graph, [], 'citeids')

        nx.set_node_attributes(self.graph, 0, 'weight')
        nx.set_node_attributes(self.graph, [], 'communities')

    def generateNode(self):
        references = getReferenceData()
        for reference in references:
            if reference['selfid'] == '':
                continue

            reference['weight'] = 0
            reference['communities'] = []

            self.graph.add_node(reference['selfid'], **reference)

    def generateEdge(self):
        nodes = self.graph.node
        for n in nodes:
            selfid = nodes[n]['selfid']
            referids = nodes[n]['referids']
            for referid in referids:
                if referid in nodes:
                    self.graph.add_edge(selfid, referid)


class AuthorNetwork(Network):
    def __init__(self):
        super(AuthorNetwork, self).__init__()
        self.graph = nx.MultiDiGraph()

        nx.set_node_attributes(self.graph, '', 'authorid')
        nx.set_node_attributes(self.graph, '', 'authorname')
        nx.set_node_attributes(self.graph, {'organizationname':'','organizationid':''}, 'organization')

        nx.set_node_attributes(self.graph, 0, 'weight')
        nx.set_node_attributes(self.graph, [], 'communities')

    def generateNode(self):
        references = getReferenceData()
        for reference in references:
            for author in reference['authors']:
                if author['authorid'] not in self.graph.nodes:
                    attr = {}
                    attr['authorid'] = author['authorid']
                    attr['authorname'] = author['authorname']
                    attr['organization'] = {}
                    attr['organization']['organizationid'] = author['organizationid']
                    attr['organization']['organizationname'] = author['organizationname']

                    attr['weight'] = 0
                    attr['communities'] = []
                    self.graph.add_node(author['authorid'], **attr)

    def generateEdge(self):
        references = getReferenceData()
        for reference in references:
            for rrid in reference['referids']:
                rreference = getReferenceDataById(rrid)
                if rreference:
                    for author in reference['authors']:
                        aid = author['authorid']
                        for rauthor in rreference['authors']:
                            raid = rauthor['authorid']
                            relation = {'refer':{'id':reference['selfid'],'title':reference['title']},
                            'cited':{'id':rreference['selfid'],'title':rreference['title']}}
                            self.graph.add_edge(aid, raid, relation=relation)
