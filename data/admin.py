# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Reference

# Register your models here.

class ReferenceAdmin(admin.ModelAdmin):
    list_display = ['selfid', 'url', 'title', 'authors', 'abstract', 'sources', 'year',
    'fields', 'publication', 'doi', 'referids', 'citeids']

admin.site.register(Reference,ReferenceAdmin)
