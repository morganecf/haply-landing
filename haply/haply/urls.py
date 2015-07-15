from django.conf.urls import patterns, include, url
from django.contrib import admin
from haply_landing import views

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),
    
    #url(r'^$', include('haply_landing.urls', namespace='haply_landing')),
    url(r'^$', views.index, name='index'),
    url(r'^simulation/', views.simulation, name='simulation'),
    url(r'^bye/', views.bye, name='bye'),
    url(r'^brochure/', views.brochure, name='brochure'),
    url(r'^lifeaquatic/', views.life_aquatic, name='life_aquatic'),
    url(r'^ripple/', views.ripple_test, name='ripple_test')
)
