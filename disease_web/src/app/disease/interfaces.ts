export interface Panel {
    name:string,
    genes:string,
}

export interface Disease {
    id:Number,
    name:string,
    comment:string,
    analysis_comment:string,
    associated_panels:Panel[],
}
