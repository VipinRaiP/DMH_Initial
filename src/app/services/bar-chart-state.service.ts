
import { Subject } from 'rxjs';
import { BarChartStateParameters } from '../model/barChartStateParameters.model';
import { BarChartStateDataReq } from '../model/barChartStateDataReq.model';



export class BarChartStateService{
    private parameters:BarChartStateParameters;
    private parametersUpdated = new Subject<BarChartStateParameters>();

    private chartData:any;
    private chartDataUpdated = new Subject<any>();

    private dataReq:BarChartStateDataReq;
    private dataReqUpdated = new Subject<BarChartStateDataReq>();

    getParametersUpdateListener(){
        return this.parametersUpdated.asObservable();
    }

    getParameters(){
        return this.parameters;
    }

    updateParameters(newParameters:BarChartStateParameters){
        console.log("state chart parameter updated")
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

    createDataReq(newDataReq:BarChartStateDataReq){
        console.log("Data req created in for State chart")
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
        console.log("State Data updated");
        console.log(newData);
        this.chartData = newData;
        this.chartDataUpdated.next(this.chartData);
    }    
}