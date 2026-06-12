export interface Gene {
    id:Number,
    symbol:string,
    description:string,
}

export interface Panel {
    id:Number,
    name:string,
    genes:Gene[],
    rank?:Number,  // optional, for use in associated panels
}

export interface Disease {
    id:Number,
    name:string,
    general_info:string,
    associated_panels:Panel[],
    filter_info:string,
    analysis_features:string,
    report_info:string,
    report_text:string,
    report_tech:string,
}

export interface DiseasePanel {
    id:Number,
    disease_name:string,
    panel_name:string,
    rank:Number,
}

export interface EditingNote {
    disease:Number,
    note:string,
    created_by:string,
    created_at:string,
}
