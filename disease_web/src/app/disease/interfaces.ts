export interface Panel {
    name:string,
    genes:string,
    rank?:Number,  // optional, for use in associated panels
}

export interface Disease {
    id:Number,
    name:string,
    comment:string,
    analysis_comment:string,
    associated_panels:Panel[],
}

export interface DiseasePanel {
    id:Number,
    disease_name:string,
    panel_name:string,
    rank:Number,
}
