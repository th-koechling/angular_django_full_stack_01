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
        panels_data = validated_data.pop('associated_panels', [])
        instance.name = validated_data.get('name', instance.name)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.analysis_comment = validated_data.get('analysis_comment', instance.analysis_comment)
        instance.save()
        for dp in DiseasePanel.objects.all():
            print(f"DEBUG B.E.F.O.R.E.: DiseasePanel: {dp.disease.name}, Panel: {dp.panel.name}, Rank: {dp.rank}")
        # Update associated panels:
        if panels_data:
            diseasePanelsBuffer = DiseasePanel.objects.filter(disease=instance)
            rank_dict = {}
            for dp in diseasePanelsBuffer:
                rank_dict[dp.panel.name] = dp.rank  # save existing ranks in a dict
            instance.associated_panels.clear()      # because the related diseaePanels and ranks are deleted here
            print("DEBUG: diseasePanels: ")
            for panel_data in panels_data:
                panel, created = Panel.objects.get_or_create(**panel_data)
                instance.associated_panels.add(panel)
            print("DEBUG: diseasePanelsBuffer: ", diseasePanelsBuffer)
            for dp in diseasePanelsBuffer:
                print(f"rank_dict[{dp.panel.name}] = {rank_dict.get(dp.panel.name)}")
                DiseasePanel.objects.filter(disease=instance, panel=dp.panel).update(rank=rank_dict.get(dp.panel.name))
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

