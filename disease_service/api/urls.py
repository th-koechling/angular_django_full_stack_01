from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GeneViewSet
from .views import DiseaseViewSet
from .views import PanelViewSet
from .views import DiseasePanelViewSet

router = DefaultRouter()
router.register(r'genes', GeneViewSet)
router.register(r'diseases', DiseaseViewSet)
router.register(r'panels', PanelViewSet)
router.register(r'diseasepanels', DiseasePanelViewSet)

urlpatterns = [
    path('api/', include(router.urls))
]
