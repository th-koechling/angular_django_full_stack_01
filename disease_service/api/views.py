from rest_framework import viewsets
from .models import Gene
from .models import Disease
from .models import DiseasePanel
from .models import Panel
from .models import EditingNote
from .serializers import GeneSerializer
from .serializers import DiseaseSerializer
from .serializers import PanelSerializer
from .serializers import DiseasePanelSerializer
from .serializers import EditingNoteSerializer


class GeneViewSet(viewsets.ModelViewSet):
    queryset = Gene.objects.all().order_by('symbol')
    serializer_class = GeneSerializer

class DiseaseViewSet(viewsets.ModelViewSet):
    queryset = Disease.objects.all().order_by('name')
    serializer_class = DiseaseSerializer

class PanelViewSet(viewsets.ModelViewSet):
    queryset = Panel.objects.all().order_by('id')
    serializer_class = PanelSerializer

class EditingNoteViewSet(viewsets.ModelViewSet):
    queryset = EditingNote.objects.all().order_by('-created_at')
    serializer_class = EditingNoteSerializer

class DiseasePanelViewSet(viewsets.ModelViewSet):
    queryset = DiseasePanel.objects.all()
    serializer_class = DiseasePanelSerializer
