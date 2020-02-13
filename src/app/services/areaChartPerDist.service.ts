
import { AreaChartPerDistParameters } from '../model/areaChartPerDistParameters.model';
import { Subject } from 'rxjs';
import { AreaChartPerDistDataReq } from '../model/areaChartPerDistDataReq.model';


export class AreaChartPerDistService{
    private parameters:AreaChartPerDistParameters;
    private parametersUpdated = new Subject<AreaChartPerDistParameters>();

    private dataReq:AreaChartPerDistDataReq;
    private dataReqUpdated = new Subject<AreaChartPerDistDataReq>();

    private chartData:any;
    private chartDataUpdated = new Subject<any>();

    getParametersUpdateListener(){
        return this.parametersUpdated.asObservable();
    }

    getParameters(){
        return this.parameters;
    }

    updateParameters(newParameters:AreaChartPerDistParameters){
        console.log("called areachat parameter service")
        console.log(newParameters);
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

    createDataReq(newDataReq:AreaChartPerDistDataReq){
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
        console.log("Update received");
        console.log(newData);
        this.chartData = newData;
        this.chartDataUpdated.next(this.chartData);
    }

}