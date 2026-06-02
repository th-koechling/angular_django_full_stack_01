from django.db import models
from simple_history.models import HistoricalRecords


class Gene(models.Model):
    symbol = models.CharField(max_length=100, unique=True) 
    # <- unique not working if serializer uses default unique validator
    description = models.CharField(max_length=500, blank=True, null=True)
    history = HistoricalRecords(table_name='gene_history')

    class Meta:
        db_table = 'gene'

    def __str__(self):
        return self.symbol


class Panel(models.Model):
    name = models.CharField(max_length=500, unique=True)
    genes = models.ManyToManyField(Gene, blank=True, null=True)
    history = HistoricalRecords(table_name='panel_history', m2m_fields=['genes'])

    class Meta:
        db_table = 'panel'

    def __str__(self):
        return self.name


class Disease(models.Model):
    name = models.CharField(max_length=250, unique=True)
    general_info = models.TextField(max_length=50000, blank=True, null=True)
    filter_info = models.TextField(max_length=50000, blank=True, null=True)
    analysis_features = models.TextField(
        max_length=50000, blank=True, null=True
    )
    report_info = models.TextField(max_length=50000, blank=True, null=True)
    report_text = models.TextField(max_length=50000, blank=True, null=True)
    report_tech = models.TextField(max_length=50000, blank=True, null=True)
    associated_panels = models.ManyToManyField(
        Panel, through="DiseasePanel", blank=True, null=True)
    history = HistoricalRecords()
    class Meta:
        db_table = 'disease'

    def __str__(self):
        return self.name


class EditingNote(models.Model):
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    note = models.TextField(max_length=50000, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.CharField(max_length=100, blank=True, null=True)    

    class Meta:
        db_table = 'editing_note'

    def __str__(self):
        return f"Note for {self.disease.name} at {self.created_at}"


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

    # history = HistoricalRecords()

    def __str__(self):
        return f"{self.disease.name} - {self.panel.name}"
