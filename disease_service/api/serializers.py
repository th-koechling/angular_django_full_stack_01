from rest_framework import serializers
from .models import Disease
from .models import Panel
from .models import DiseasePanel


class PanelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panel
        fields = (
            'id',
            'name',
            'genes',
        )

class PanelCustomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Panel
        fields = (
            'id',
            'name',
        )

class DiseasePanelSerializer(serializers.ModelSerializer):
    print("DEBUG: Inside DiseasePanelSerializer")
    disease_name = serializers.CharField(source="disease.name", read_only=True)
    panel_name = serializers.CharField(source="panel.name", read_only=True)
    class Meta:
        model = DiseasePanel
        fields = (
            'id',
            'disease_name',
            'panel_name',
            'rank',
        )


class DiseaseSerializer(serializers.ModelSerializer):
    associated_panels = PanelSerializer(many=True, required=False, read_only=False)
    #associated_panels = PanelCustomSerializer(many=True, required=False, read_only=False)
    class Meta:
        model = Disease
        fields = (
            'id',
            'name',
            'comment',
            'analysis_comment',
            'associated_panels',
        )

    def update(self, instance, validated_data):
        print("DEBUG: Inside DiseaseSerializer.update")
        panels_data = validated_data.pop('associated_panels', [])
        instance.name = validated_data.get('name', instance.name)
        print("instance.name: ", instance.name)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.analysis_comment = validated_data.get('analysis_comment', instance.analysis_comment)
        instance.save()
        for dp in DiseasePanel.objects.all():
            print(f"DEBUG B.E.F.O.R.E.: DiseasePanel: {dp.disease.name}, Panel: {dp.panel.name}, Rank: {dp.rank}")
        # Update associated panels:
        if panels_data:
            print("DEBUG: panels_data: ", panels_data)
            #instance.associated_panels.clear()  # is there maybe a non destructive way to do this??? "detach" or so??? TODOOOO I AM HEEEEEREEE!!!!!!
            # <- is this a solution? like just not clear, but (update existing and add new only???)
            print("DEBUG: diseasePanels: ")
            for dp in DiseasePanel.objects.all():    # <- at this point the related dieseasePanels are deleted!!! i need to save the rank first!
                print(dp.id)
            for panel_data in panels_data:
                print("DEBUG: panel_data: ", panel_data)
                panel, created = Panel.objects.get_or_create(**panel_data)
                instance.associated_panels.add(panel)
                print(f"DEBUG: rank in serializer: {panel_data.get('rank')}")   # <- this is always None!!! its not a panel field (only in diseasePanel)!!!
                #DiseasePanel.objects.filter(disease=instance, panel=panel).update(rank=panel_data.get('rank'))
                #DiseasePanel.objects.filter(disease=instance, panel=panel).update(rank=7777777)
        for dp in DiseasePanel.objects.all(): 
            print(f"DEBUG A.F.T.E.R.: DiseasePanel: {dp.disease.name}, Panel: {dp.panel.name}, Rank: {dp.rank}")
        return instance

    # old create method, actually writes if a panel does not exist :
    def __MASK__create(self, validated_data):
        panels_data = validated_data.pop('associated_panels', [])
        disease = Disease.objects.create(**validated_data)
        # add associated panels:
        for panel_data in panels_data:
            panel, created = Panel.objects.get_or_create(**panel_data)
            disease.associated_panels.add(panel)
        return disease

    # new create method, only adds existing panels:
    def create(self, validated_data):
        panels_data = validated_data.pop('associated_panels', [])
        print(f"panels_data: {panels_data}")
        disease = Disease.objects.create(**validated_data)
        # add associated panels:
        for panel_data in panels_data:
            print(panel_data.get('id'))
            panel_id = panel_data.get('id')
            panel_name = panel_data.get('name')
            #if panel_id:
            if panel_name:
                try:
                    panel = Panel.objects.get(name=panel_name)
                    disease.associated_panels.add(panel)
                except Panel.DoesNotExist:
                    continue
        return disease

