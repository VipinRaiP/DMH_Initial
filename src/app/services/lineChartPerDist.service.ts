
import { LineChartPerDistParameters, LineChartPerDistDataReq } from '../model/linechartPerDistParameters.model';
import { Subject } from 'rxjs';


export class LineChartPerDistService{
    private parameters:LineChartPerDistParameters;
    private parametersUpdated = new Subject<LineChartPerDistParameters>();

    private dataReq:LineChartPerDistDataReq;
    private dataReqUpdated = new Subject<LineChartPerDistDataReq>();

    private chartData:any;
    private chartDataUpdated = new Subject<any>();


    getParametersUpdateListener(){
        return this.parametersUpdated.asObservable();
    }

    getParameters(){
        return this.parameters;
    }

    updateParameters(newParameters:LineChartPerDistParameters){
        console.log("Line chart : Parameter update received")
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

    createDataReq(newDataReq:LineChartPerDistDataReq){
        console.log("Line Chart : Data req received");
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
        console.log("Line Chart : Data update received");
        console.log(newData);
        this.chartData = newData;
        this.chartDataUpdated.next(this.chartData);
    }


}