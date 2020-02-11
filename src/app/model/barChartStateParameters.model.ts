export interface BarChartStateParameters{
    yLabel:string,
    dataURL:{
        Year:string,
        Month:string,
        Quarter:string,
    }
    threshold:number,
    yColumnName:string
}