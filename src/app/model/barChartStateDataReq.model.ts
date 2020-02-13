export interface BarChartStateDataReq{
    onSubmit:boolean,
    year:number,
    granular:number,  /* 1 : for annual , 2: Month, 3: Quarter */
    choosenValue :number,
    parameterNumber:number
}