from django.shortcuts import render
from rest_framework import viewsets
from .models import Disease
from .models import Panel
from .serializers import DiseaseSerializer
from .serializers import PanelSerializer

class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

class PanelViewSet(viewsets.ModelViewSet):
    queryset = Panel.objects.all()
    serializer_class = PanelSerializer

