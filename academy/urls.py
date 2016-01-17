"""academy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from django.contrib import admin

from academy import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),

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
]
