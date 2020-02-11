
import { BarChartAllDistParameters } from '../model/barchartAllDistParameters.model';
import { Subject } from 'rxjs';
import { BarChartAllDistDataReq } from '../model/barchartAllDistDataReq.model';
import { Injectable } from '@angular/core';

@Injectable()
export class BarChartAllDistService{
    private parameters:BarChartAllDistParameters;
    private parametersUpdated = new Subject<BarChartAllDistParameters>();
    private dataReq:BarChartAllDistDataReq;
    private dataReqUpdated = new Subject<BarChartAllDistDataReq>();

    private chartData:any;
    private chartDataUpdated = new Subject<any>();

    getParametersUpdateListener(){
        return this.parametersUpdated.asObservable();
    }

    getParameters(){
        return this.parameters;
    }

    updateParameters(newParameters:BarChartAllDistParameters){
        console.log("called")
        this.parameters = newParameters;
        this.parametersUpdated.next(this.parameters);
    }

    /* Listner for data requesting */

    getDataReqListener(){
        return this.dataReqUpdated.asObservable();
    }

    getDataReq(){
        return this.dataReq;
    }

    createDataReq(newDataReq:BarChartAllDistDataReq){
        console.log("Data req created in service.... ")
        this.dataReq = newDataReq;
        console.log(this.dataReq);
        this.dataReqUpdated.next(this.dataReq);
    }

    /* Chart Data Listener */

    getChartDataListener(){
        return this.chartDataUpdated.asObservable();
    }

    getChartData(){
        return this.chartData;
    }

    updateChartData(newData:any){
        console.log("Update recived");
        console.log(newData);
        this.chartData = newData;
        this.chartDataUpdated.next(this.chartData);
    }

}