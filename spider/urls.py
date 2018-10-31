from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.spider, name='spider'),
    url(r'^echo/$', views.echo, name='echo'),
]