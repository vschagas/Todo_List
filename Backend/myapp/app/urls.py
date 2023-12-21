from . import views
from django.urls import path


urlpatterns = [
    # path("create-task/", views.app, name="app"),
    path("create-task/", views.create_task, name="create_task"),
    path("read-task-id/", views.read_task_by_id, name="read_tasks"),
    path("read-task/", views.read_tasks, name="read_tasks"),
    path("update-task/", views.update_task, name="update_task"),
    path("delete-task/", views.delete_tasks, name="delete_tasks"),

]
