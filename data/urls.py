from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.showTable, name='showTable'),
    url(r'^deletedata/$', views.deleteData, name='deleteData'),
]