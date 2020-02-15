export interface LineChartPerDistParameters{
    yLabel:string,
    threshold:number,
    yColumnName:string,
}

export interface LineChartPerDistDataReq{
    onSubmit :boolean,
    parameterNumber :number,
    districtId :number,
    year :number   
}