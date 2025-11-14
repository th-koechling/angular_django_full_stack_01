from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DiseaseViewSet
from .views import PanelViewSet

router = DefaultRouter()
router.register(r'diseases', DiseaseViewSet)
router.register(r'panels', PanelViewSet)

urlpatterns = [
    path('api/', include(router.urls))
]
