from rest_framework import serializers
from .models import Gene
from .models import Disease
from .models import Panel
from .models import DiseasePanel


class GeneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gene
        fields = (
            'id',
            'symbol',
            'description',
        )
        extra_kwargs = {
            'symbol': {'validators': []},  # Disable unique validator for 'symbol' field
        }


class PanelSerializer(serializers.ModelSerializer):
    genes = GeneSerializer(many=True, required=False, read_only=False)
    class Meta:
        model = Panel
        fields = (
            'id',
            'name',
            'genes',
        )
        extra_kwargs = {
            'name': {'validators': []},  # Disable unique validator for 'name' field
        }
    def update(self, instance, validated_data):
        genes_data = validated_data.pop('genes', [])
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        if genes_data:
            instance.genes.clear()
            for gene_data in genes_data:
                gene, created = Gene.objects.get_or_create(**gene_data)
                instance.genes.add(gene)
        return instance

    def create(self, validated_data):
        genes_data = validated_data.pop('genes', [])
        panel = Panel.objects.create(**validated_data)
        for gene_data in genes_data:
            gene_symbol = gene_data.get('symbol')
            if gene_symbol:
                try:
                    gene = Gene.objects.get(symbol=gene_symbol)
                    panel.genes.add(gene)
                except Gene.DoesNotExist:
                    print(f'Gene with symbol {gene_symbol} does not exist. Skipping.')
                    continue
        return panel


class DiseasePanelSerializer(serializers.ModelSerializer):
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
        extra_kwargs = {
            'name': {'validators': []},  # Disable unique validator for 'name' field
        }
        fields = (
            'id',
            'name',
            'general_info',
            'analysis_notes',
            'analysis_features',
            'report_info',
            'report_text',
            'report_tech',
            'associated_panels',
        )

    def update(self, instance, validated_data):
        panels_data = validated_data.pop('associated_panels', [])
        instance.name = validated_data.get('name', instance.name)
        instance.general_info = validated_data.get('general_info', instance.general_info)
        instance.analysis_notes = validated_data.get('analysis_notes', instance.analysis_notes)
        instance.analysis_features = validated_data.get('analysis_features', instance.analysis_features)
        instance.report_info = validated_data.get('report_info', instance.report_info)
        instance.report_text = validated_data.get('report_text', instance.report_text)
        instance.report_tech = validated_data.get('report_tech', instance.report_tech)
        instance.save()
        # Update associated panels:
        if panels_data:
            diseasePanelsBuffer = DiseasePanel.objects.filter(disease=instance)
            rank_dict = {}
            for dp in diseasePanelsBuffer:
                rank_dict[dp.panel.name] = dp.rank  # save existing ranks in a dict
            instance.associated_panels.clear()      # because the related diseaePanels and ranks are deleted here
            for panel_data in panels_data:
                panel_name = panel_data.get('name')
                if panel_name:
                    try:
                        panel = Panel.objects.get(name=panel_name)
                        instance.associated_panels.add(panel)
                    except Panel.DoesNotExist:
                        continue
            for dp in diseasePanelsBuffer:
                DiseasePanel.objects.filter(disease=instance, panel=dp.panel).update(rank=rank_dict.get(dp.panel.name))
        return instance

    def create(self, validated_data):
        panels_data = validated_data.pop('associated_panels', [])
        disease = Disease.objects.create(**validated_data)
        # add associated panels:
        for panel_data in panels_data:
            panel_name = panel_data.get('name')
            if panel_name:
                try:
                    panel = Panel.objects.get(name=panel_name)
                    disease.associated_panels.add(panel)
                except Panel.DoesNotExist:
                    continue
        return disease
