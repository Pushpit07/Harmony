from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('keyboard', views.keyboard, name='keyboard'),
    path('receivednotes', views.getNotes, name='receivednotes'),
]
