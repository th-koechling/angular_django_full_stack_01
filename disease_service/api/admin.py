from django.contrib import admin
from .models import EditingNote, Gene, Panel, DiseasePanel, Disease

admin.site.register(Gene)
admin.site.register(Panel)
admin.site.register(EditingNote)
admin.site.register(DiseasePanel)
admin.site.register(Disease)
