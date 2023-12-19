from . import views
from django.urls import path


urlpatterns = [
    path("create-task/", views.app, name="app"),
]
