# -*- coding: utf-8 -*-
from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.network, name='network'),
    url(r'^kclique/$', views.kclique, name='kclique'),
]