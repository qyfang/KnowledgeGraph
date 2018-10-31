# -*- coding: utf-8 -*-
import json

from models import Reference


def deleteReferenceData():
    Reference.objects.all().delete()

def loadReferenceData():
    references = Reference.objects.all()
    referencedata = []
    for reference in references:
        item = {}
        item['selfid'] = reference.selfid
        item['url'] = reference.url
        item['title'] = reference.title
        item['authors'] = json.loads(reference.authors)
        item['abstract'] = reference.abstract
        item['year'] = reference.year
        item['sources'] = json.loads(reference.sources)
        item['doi'] = reference.doi
        item['publication'] = reference.publication
        item['fields'] = json.loads(reference.fields)
        item['referids'] = json.loads(reference.referids)
        item['citeids'] = json.loads(reference.citeids)
        referencedata.append(item)
    return referencedata
