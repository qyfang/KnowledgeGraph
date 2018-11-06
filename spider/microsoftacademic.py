# -*- coding:utf-8 -*-

import json

import requests

from data.models import Reference


class MicrosoftAcademic(object):
    def __init__(self):
        self.headers = {
            'Host': 'academic.microsoft.com',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36',
            'Referer': 'https://academic.microsoft.com/',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cookie': 'msacademic=bfd979fe-8641-4493-b57b-bf86d0fb2e13; ARRAffinity=8c385e76924c624ac612a0093192e3466363a1d76350bdcdd4b30c55a2763f97; ai_user=0m9Na|2018-10-24T13:09:02.739Z',
        }

        self.timeout = 5
        self.maxtryreloadtime = 3

    def getCookies(self):
        session = requests.session()
        session.get('https://academic.microsoft.com/#/detail/')
        cookies = ''
        for cookie in session.cookies:
            cookies += cookie.name + '=' + cookie.value + '; '
        cookies += 'ai_user=' + '0m9Na|2018-10-24T13:09:02.739Z'
        return cookies


class MicrosoftAcademicSearch(MicrosoftAcademic):
    def __init__(self, query):
        super(MicrosoftAcademicSearch, self).__init__()
        self.url = 'https://academic.microsoft.com/api/search/GetEntityResults'
        self.data = {'Query': '%40' + query + '%40'}

    def loadPage(self):
        for reloadtime in range(self.maxtryreloadtime):
            try:
                # cookies = self.getCookies()
                # self.headers['Cookie'] = cookies
                response = requests.post(self.url, headers=self.headers, timeout=self.timeout, data=self.data)
            except:
                if reloadtime < self.maxtryreloadtime - 1:
                    continue
                else:
                    return
            else:
                page = response.content
                return page

    def parsePage(self, page):
        jsondata = json.loads(page)
        publications = jsondata['publicationResults']['publications']
        results = []
        for publication in publications:
            result = {}
            result['id'] = str(publication['id'])
            result['title'] = publication['e']['dn']
            result['authors'] = [aa['dAuN'] for aa in publication['aa']]

            duplicate = lambda x,y:x if y in x else x + [y]
            result['authors'] = reduce(duplicate, [[], ] + result['authors'])

            results.append(result)
        return results

    def getQueryResults(self):
        page = self.loadPage()
        if page:
            results = self.parsePage(page)
            return results
        else:
            return


class MicrosoftAcademicSpider(MicrosoftAcademic):
    def __init__(self, entityid):
        super(MicrosoftAcademicSpider, self).__init__()
        self.url = 'https://academic.microsoft.com/api/browse/GetEntityDetails?entityId=' + entityid

        self.reference = {}

    def showReferenceInfo(self, num=0):
        print '['+str(num)+']',self.reference['id'],'-',self.reference['title']
        print '[url]:',self.reference['url']
        print '[authors]:',','.join([author['authorname'] for author in self.reference['authors']])
        print '[abstract]:',self.reference['abstract']
        print '[referids]:',','.join(self.reference['referids'])
        print '[citeids]:',','.join(self.reference['citeids'])
        print ''

    def storeReferenceData(self):
        selfid = self.reference['id']
        title = self.reference['title']
        url = self.reference['url']
        authors = json.dumps(self.reference['authors'])
        abstract = self.reference['abstract']
        year = self.reference['year']
        sources = json.dumps(self.reference['sources'])
        doi = self.reference['doi']
        publication = self.reference['publication']
        fields = json.dumps(self.reference['fields'])
        referids = json.dumps(self.reference['referids'])
        citeids = json.dumps(self.reference['citeids'])

        obj, created = Reference.objects.get_or_create(selfid=selfid, title=title, url=url,
            authors=authors, abstract=abstract, year=year, sources=sources, doi=doi,
            publication=publication, fields=fields, referids=referids, citeids=citeids)

        return created

    def getNextRoundIds(self):
        referids = self.reference['referids']
        citeids = self.reference['citeids']
        return referids

    def loadPage(self):
        for reloadtime in range(self.maxtryreloadtime):
            try:
                # cookies = self.getCookies()
                # self.headers['Cookie'] = cookies
                response = requests.get(self.url, headers=self.headers, timeout=self.timeout)
            except:
                if reloadtime < self.maxtryreloadtime - 1:
                    continue
                else:
                    return
            else:
                page = response.content
                return page

    def parsePage(self, page):
        jsondata = json.loads(page)

        try:
            self.reference['id'] = str(jsondata['entity']['id'])
            self.reference['title'] = jsondata['entityTitle']
        except:
            return False

        self.reference['url'] = 'https://academic.microsoft.com/#/detail/' + self.reference['id']

        try:
            self.reference['abstract'] = jsondata['abstract']
        except :
            self.reference['abstract'] = ''

        try:
            self.reference['year'] = str(jsondata['year'])
        except :
            self.reference['year'] = ''

        try:
            self.reference['fields'] = [{'fieldname': field['lt'], 'fieldid': str(field['id'])} for field in jsondata['fieldsOfStudy']]
        except :
            self.reference['fields'] = []

        try:
            self.reference['sources'] = [source['u'] for source in jsondata['sources']]
        except :
            self.reference['sources'] = []

        try:
            self.reference['doi'] = jsondata['entity']['e']['doi']
        except :
            self.reference['doi'] = ''

        try:
            self.reference['publication'] = jsondata['entity']['e']['bv']
        except :
            self.reference['publication'] = ''

        try:
            self.reference['authors'] = []
            for author in jsondata['authors']:
                au={}
                try:
                    au['authorname'] = author['lt']
                    au['authorid'] = str(author['id'])
                except:
                    au['authorname'] = ''
                    au['authorid'] = ''
                try:
                    au['organizationname'] = author['lt2']
                    au['organizationid'] = str(author['id2'])
                except:
                    au['organizationname'] = ''
                    au['organizationid'] = ''
                self.reference['authors'].append(au)
        except :
            self.reference['authors'] = []

        try:
            self.reference['referids'] = [str(referid) for referid in jsondata['entity']['rId']]
        except :
            self.reference['referids'] = []

        try:
            self.reference['citeids'] = [str(citeid['paper']['id']) for citeid in jsondata['citations']['e']]
        except :
            self.reference['citeids'] = []

        return True


# if __name__ == '__main__':
#     spider = MicrosoftAcademicSpider('2168869093')
#     page = spider.loadPage()
#     spider.parsePage(page)
#     spider.showReferenceInfo()

#     search = MicrosoftAcademicSearch('hydrogen')
#     print search.getQueryResults()
