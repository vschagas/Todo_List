from . import views
from django.urls import path


urlpatterns = [
    # path("create-task/", views.app, name="app"),
    path("create-task/", views.create_task, name="app"),

]
