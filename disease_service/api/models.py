from django.db import models

class DeletemeBecauseIamOnlyForTesting(models.Model):
    name = models.CharField(max_length=100)
    class Meta:
        db_table = 'deleteme_testing'
    def __str__(self):
        return self.name

class Gene(models.Model):
    symbol = models.CharField(max_length=100, unique=False)
    description = models.CharField(max_length=500, blank=True, null=True)
    class Meta:
        db_table = 'gene'
    def __str__(self):
        return self.symbol


class Panel(models.Model):
    name = models.CharField(max_length=500, unique=False)
    genes = models.ManyToManyField(Gene, blank=True, null=True)
    class Meta:
        db_table = 'panel'
    def __str__(self):
        return self.name


class Disease(models.Model):
    name = models.CharField(max_length = 250, unique=False)
    comment = models.TextField(max_length = 50000, blank=True, null=True)
    analysis_comment = models.TextField(max_length = 50000, blank=True, null=True)
    associated_panels = models.ManyToManyField(Panel, through="DiseasePanel", blank=True, null=True)
    class Meta:
        db_table='disease'
    def __str__(self):
        return self.name


class DiseasePanel(models.Model):
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    panel = models.ForeignKey(Panel, on_delete=models.CASCADE)
    rank = models.PositiveIntegerField(blank=True, null=True)
    class Meta:
        db_table = 'disease_panel'
        constraints = [
            models.UniqueConstraint(
                fields=['disease', 'panel'], name='unique_disease_panel'
            )
        ]
    def __str__(self):
        return f"{self.disease.name} - {self.panel.name}"

