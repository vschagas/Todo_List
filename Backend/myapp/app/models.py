from django.db import models


class Task(models.Model):
    task = models.CharField(max_length=255)
    status = models.CharField(max_length=20)
