from django.shortcuts import render
from rest_framework import viewsets
from .models import Disease
from .models import DiseasePanel
from .models import Panel
from .serializers import DiseaseSerializer
from .serializers import PanelSerializer
from .serializers import DiseasePanelSerializer

class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

class PanelViewSet(viewsets.ModelViewSet):
    queryset = Panel.objects.all()
    serializer_class = PanelSerializer

class DiseasePanelViewSet(viewsets.ModelViewSet):
    queryset = DiseasePanel.objects.all()
    serializer_class = DiseasePanelSerializer


def index(request):
    #disease_panels = DiseasePanel.objects.all()
    disease_panels = DiseasePanel.objects.prefetch_related('disease', 'panel').all()
    for dp in disease_panels:
        print(f"Disease: {dp.disease.name}, Panel: {dp.panel.name}, Rank: {dp.rank}")
    return render(request, 'api/index.html', {'disease_panels': disease_panels})
