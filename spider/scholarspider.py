# -*- coding:utf-8 -*-

import re

import difflib

from time import sleep

from microsoftacademic import MicrosoftAcademicSearch, MicrosoftAcademicSpider

from googlescholar import GoogleScholarSearch

class ScholarSpider(object):
    def __init__(self, configparam):
        self.keyword = configparam['keyword']
        self.targetbreadth = configparam['breadth']
        self.targetforwarddepth = configparam['forwarddepth']
        self.targetbackwarddepth = configparam['backwarddepth']
        self.intervaltime = 3

    def compareItem(self, reference, result):
        ptitle = reference['title']
        ptitle = ptitle.replace('(', '\(').replace(')', '\)').replace('[', '\[').replace(']', '\]')
        ptitle = ptitle.replace('+', '\+').replace('*', '\*').replace('$', '\$').replace('^', '\^')
        ptitle = ptitle.replace('?', '\?')
        pattern = re.compile(ptitle+r'$', re.I)
        match1 = re.match(pattern, result['title'])
        if match1:
            for (author1,author2) in zip(reference['authors'], result['authors']):
                seq = difflib.SequenceMatcher(None, author1, author2)
                ratio = seq.ratio()
                if ratio < 0.5:
                    return False
            return True
        else:
            return False

    def getRootIds(self):
        rootids = []
        googlescholarsearch = GoogleScholarSearch(self.keyword, self.targetbreadth)
        references = googlescholarsearch.getRootReference()
        for reference in references:
            sleep(self.intervaltime)
            microsoftacademicsearch = MicrosoftAcademicSearch(reference['title'])
            results = microsoftacademicsearch.getQueryResults()
            for result in results:
                matchflag = self.compareItem(reference, result)
                if matchflag:
                    rootids.append(result['id'])
                    break
        return rootids

    def crawl(self, request):
        num = 0
        thisroundids = self.getRootIds()
        for currentforwarddepth in range(1, self.targetforwarddepth+1):
            nextroundids = []

            for currentid in thisroundids:
                sleep(self.intervaltime)
                spider = MicrosoftAcademicSpider(currentid)
                page = spider.loadPage()
                if page:
                    parseflag = spider.parsePage(page)
                    if parseflag:
                        # spider.showReferenceInfo(num)

                        created = spider.storeReferenceData()

                        if created:
                            num += 1
                            senddata = str(str(num) + '-' + spider.reference['title'])
                            request.websocket.send(senddata)

                            referids = spider.getNextRoundIds()
                            nextroundids += referids

            duplicate = lambda x,y:x if y in x else x + [y]
            thisroundids = reduce(duplicate, [[], ] + nextroundids)


def runSpider(request, keyword, breadth, forwarddepth, backwarddepth=0):
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')

    configparam = {
        'keyword': keyword,
        'breadth': breadth,
        'forwarddepth': forwarddepth,
        'backwarddepth': backwarddepth,
    }
    spider = ScholarSpider(configparam)

    spider.crawl(request)
