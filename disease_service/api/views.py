from django.shortcuts import render
from rest_framework import viewsets
from .models import Gene
from .models import Disease
from .models import DiseasePanel
from .models import Panel
from .serializers import GeneSerializer
from .serializers import DiseaseSerializer
from .serializers import PanelSerializer
from .serializers import DiseasePanelSerializer


class GeneViewSet(viewsets.ModelViewSet):
    queryset = Gene.objects.all().order_by('symbol')
    serializer_class = GeneSerializer

class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all().order_by('name')
    serializer_class = DiseaseSerializer

class PanelViewSet(viewsets.ModelViewSet):
    queryset = Panel.objects.all().order_by('id')
    serializer_class = PanelSerializer

class DiseasePanelViewSet(viewsets.ModelViewSet):
    queryset = DiseasePanel.objects.all()
    serializer_class = DiseasePanelSerializer
