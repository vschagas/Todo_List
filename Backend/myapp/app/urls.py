from . import views
from django.urls import path


urlpatterns = [
    # path("create-task/", views.app, name="app"),
    path("create-task/", views.create_task, name="app"),
    path("read-task/", views.read_tasks, name="app"),
    path("update-task/", views.update_task, name="app"),

]
