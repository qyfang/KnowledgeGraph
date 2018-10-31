# -*- coding:utf-8 -*-
import re

import requests

from bs4 import BeautifulSoup


class GoogleScholarSearch(object):
    def __init__(self, keyword, targetbreadth):
        self.keyword = keyword
        self.targetbreadth = targetbreadth

        self.url = 'https://x.glgoo.top/scholar?hl=zh-CN&q=' + self.keyword + '&start='
        self.headers = {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Cache-Control': 'max-age=0',
            'Connection': 'keep-alive',
            'Host': 'x.glgoo.top',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
        }

        self.timeout = 5
        self.maxtryreloadtime = 3

    def loadPage(self, pagenum):
        url = self.url + str(pagenum)
        for reloadtime in range(self.maxtryreloadtime):
            try:
                response = requests.get(url, headers=self.headers, timeout=self.timeout)
            except:
                if reloadtime < self.maxtryreloadtime - 1:
                    continue
                else:
                    return
            else:
                page = response.content
                soup = BeautifulSoup(page, 'html.parser')
                return soup

    def parsePage(self, soup):
        results = []
        items = soup.select('.gs_ri')
        for item in items:
            try:
                a = item.select('.gs_rt > a')[0]
                gs_a = item.select('.gs_a')[0]
                title = a.text
                authors = re.sub(r'- .*$', '', gs_a.text).replace('…', '').strip().split(', ')
                reference = {}
                reference['title'] = title
                reference['authors'] = authors
                results.append(reference)
            except:
                pass

        return results

    def getRootReference(self):
        references = []
        pagenum = -1
        while True:
            pagenum += 1
            soup = self.loadPage(pagenum*10)
            if soup:
                results = self.parsePage(soup)
                references += results
                if not results:
                    # print 'NO RESULTS'
                    break
                if len(references) >= self.targetbreadth:
                    references = references[:self.targetbreadth]
                    break
            else:
                # print 'TIME OUT'
                break
        return references


# if __name__ == '__main__':
#     import sys
#     reload(sys)
#     sys.setdefaultencoding('utf8')

#     search = GoogleScholarSearch('hydrogen', 10)
#     print search.getRootReference()
