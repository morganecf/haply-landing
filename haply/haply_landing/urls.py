from django.conf.urls import patterns, url
from haply_landing import views

urlpatterns = patterns('',
	url(r'^$', views.index, name='index'),
	url(r'^simulation/', views.simulation, name='simulation'),
	url(r'^bye/', views.bye, name='bye'),
	url(r'^lifeaquatic/', views.life_aquatic, name='life_aquatic'),
)
