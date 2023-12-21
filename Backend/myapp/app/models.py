from django.db import models


class Task(models.Model):
    task = models.CharField(max_length=255)
    status = models.CharField(max_length=20)
    image_url = models.URLField(null=True, blank=True)
