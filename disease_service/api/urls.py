from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GeneViewSet
from .views import DiseaseViewSet
from .views import PanelViewSet
from .views import DiseasePanelViewSet
from .views import EditingNoteViewSet

router = DefaultRouter()
router.register(r'genes', GeneViewSet)
router.register(r'diseases', DiseaseViewSet)
router.register(r'panels', PanelViewSet)
router.register(r'diseasepanels', DiseasePanelViewSet)
router.register(r'editingnotes', EditingNoteViewSet)

urlpatterns = [
    path('api/', include(router.urls))
]
