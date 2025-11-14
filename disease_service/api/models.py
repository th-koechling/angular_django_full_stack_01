from django.db import models


class Panel(models.Model):
    name = models.CharField(max_length=500)
    genes = models.CharField(max_length=1000)
    class Meta:
        db_table = 'panel'
    def __str__(self):
        return self.name


class Disease(models.Model):
    name = models.CharField(max_length = 250)
    comment = models.TextField(max_length = 50000, null=True)
    analysis_comment = models.TextField(max_length = 50000, null=True)
    associated_panels = models.ManyToManyField(Panel, blank=True)
    class Meta:
        db_table='disease'
    def __str__(self):
        return self.name
