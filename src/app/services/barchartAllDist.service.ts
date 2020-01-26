
import { BarChartAllDistParameters } from '../model/barchartAllDistParameters.model';
import { Subject } from 'rxjs';


export class BarChartAllDistService{
    private parameters:BarChartAllDistParameters;
    private parametersUpdated = new Subject<BarChartAllDistParameters>();

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
}