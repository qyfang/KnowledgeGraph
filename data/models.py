# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

# Create your models here.

class Reference(models.Model):
    selfid = models.CharField(max_length=30, unique=True)
    url = models.TextField(blank=True)
    title = models.TextField(blank=True)
    authors = models.TextField(blank=True)
    abstract = models.TextField(blank=True)
    year = models.TextField(blank=True)
    sources = models.TextField(blank=True)
    doi = models.TextField(blank=True)
    publication = models.TextField(blank=True)
    fields = models.TextField(blank=True)
    referids = models.TextField(blank=True)
    citeids = models.TextField(blank=True)
