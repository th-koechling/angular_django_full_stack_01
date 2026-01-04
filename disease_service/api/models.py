from django.db import models


class Gene(models.Model):
    symbol = models.CharField(max_length=100, unique=False)
    description = models.CharField(max_length=500, null=True)
    class Meta:
        db_table = 'gene'
    def __str__(self):
        return self.symbol

# TODO: I AM HERE -> convert the string based 'genes' field to a ManyToManyField to Gene model

class Panel(models.Model):
    name = models.CharField(max_length=500, unique=False)
    genes = models.ManyToManyField(to=Gene, blank=True)
    #genes = models.CharField(max_length=1000)
    class Meta:
        db_table = 'panel'
    def __str__(self):
        return self.name


class Disease(models.Model):
    name = models.CharField(max_length = 250, unique=False)
    comment = models.TextField(max_length = 50000, null=True)
    analysis_comment = models.TextField(max_length = 50000, null=True)
    associated_panels = models.ManyToManyField(Panel, through="DiseasePanel", blank=True)
    class Meta:
        db_table='disease'
    def __str__(self):
        return self.name


class DiseasePanel(models.Model):
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    panel = models.ForeignKey(Panel, on_delete=models.CASCADE)
    rank = models.PositiveIntegerField(null=True)
    class Meta:
        db_table = 'disease_panel'
        constraints = [
            models.UniqueConstraint(
                fields=['disease', 'panel'], name='unique_disease_panel'
            )
        ]
    def __str__(self):
        return f"{self.disease.name} - {self.panel.name}"

