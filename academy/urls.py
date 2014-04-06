from django.conf.urls import patterns, include, url
from django.contrib import admin

from . import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'academy.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', views.FrontView.as_view(), name='front'),
    url(r'^game/$', views.GameListView.as_view(), name='game_list'),
    url(r'^game/simulate/$', views.GameSimulateView.as_view(), name='game_simulate'),
    url(r'^game/new/$', views.GameCreateView.as_view(), name='game_create'),
    url(r'^game/(?P<pk>\d+)/$', views.GameView.as_view(), name='game'),
    url(r'^game/(?P<pk>\d+)/play/$', views.GamePlayView.as_view(), name='game_play'),
    url(r'^game/(?P<pk>\d+)/save/$', views.GameSaveView.as_view(), name='game_save'),
    url(r'^player/$', views.PlayerListView.as_view(), name='player_list'),
    url(r'^player/new/$', views.PlayerCreateView.as_view(), name='player_create'),
    url(r'^player/(?P<pk>\d+)/$', views.PlayerView.as_view(), name='player'),
)
