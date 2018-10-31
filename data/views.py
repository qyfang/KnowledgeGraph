# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from django.http import JsonResponse

from data import deleteReferenceData, loadReferenceData

# Create your views here.

def showTable(request):
    references = loadReferenceData()

    return render(request, 'data/data.html',
     context={'references': references})

def deleteData(request):
    deleteReferenceData()
    return JsonResponse('', safe=False)
