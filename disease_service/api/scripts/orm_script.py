from api.models import Panel, Disease, DiseasePanel
from django.db import connection
#from django.shortcuts import get_object_or_404
#from pprint import pprint

def run():
    # useful functions to check out:
    # add, all, first, count, remove, set, clear, create, get_or_create, filter

    panel_01, created = Panel.objects.get_or_create(name="SickSickSick Panel", genes="GENE1,GENE2,GENE3,GENE4")
    panel_02, created = Panel.objects.get_or_create(name="VerySick Panel", genes="GENE5,GENE6,GENE7")
    disease, created = Disease.objects.get_or_create(name="SuperDuperSick Disease", comment="This disease makes you super duper sick.")
    disease.associated_panels.clear()

    rank_one = 1
    rank_two = 2
    disease.associated_panels.add(panel_01, through_defaults={'rank': rank_one})
    disease.associated_panels.add(panel_02, through_defaults={'rank': rank_two})

    """
    DiseasePanel.objects.create(
        disease=disease,
        panel=panel_01,
        rank=1
    )

    DiseasePanel.objects.create(
        disease=disease,
        panel=panel_02,
        rank=2
    )
    """

    for dp in DiseasePanel.objects.filter(disease=disease):
        print(f"Disease: {dp.disease.name}, Panel: {dp.panel.name}, Rank: {dp.rank}")


    # AI generated:
    # Example: Create a new Disease and associate it with Panels with ranks
    #disease = Disease.objects.create(name="Example Disease", comment="This is an example disease.")
    
    #panel1 = Panel.objects.create(name="Panel 1", genes="GeneA,GeneB")
    #panel2 = Panel.objects.create(name="Panel 2", genes="GeneC,GeneD")

    #print(DiseasePanel.objects.all())

    #DiseasePanel.objects.create(disease=disease, panel=panel1, rank=1)
    #DiseasePanel.objects.create(disease=disease, panel=panel2, rank=2)
    
    # Fetch and print the disease with its associated panels and ranks
    #disease_with_panels = Disease.objects.prefetch_related('diseasepanel_set__panel').get(id=disease.id)
    #for dp in disease_with_panels.diseasepanel_set.all():
    #    print(f"Disease: {disease_with_panels.name}, Panel: {dp.panel.name}, Rank: {dp.rank}")
    # End of AI generated code
