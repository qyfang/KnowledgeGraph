# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from dwebsocket import accept_websocket

from scholarspider import runSpider

# Create your views here.

def spider(request):
    return render(request, 'spider/spider.html')

@accept_websocket
def echo(request):
    while True:
        message = request.websocket.wait()
        message = str(message)
        message = message.split(',')
        keyword = message[0]
        breadth = message[1]
        depth = message[2]

        if (keyword != '' and breadth != '' and depth != ''):
            breadth = int(breadth)
            depth = int(depth)

            border = str(20 * '-' + '[ ' + keyword + ' ]  start crawling' + 20 * '-')
            request.websocket.send(border)

            runSpider(request, keyword, breadth, depth)

            border = str(20 * '-' + '[ ' + keyword + ' ]  finish crawling' + 20 * '-')
            request.websocket.send(border)
