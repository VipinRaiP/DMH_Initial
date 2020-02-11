
import { Subject } from 'rxjs';
import { BarChartStateParameters } from '../model/barChartStateParameters.model';



export class BarChartStateService{
    private parameters:BarChartStateParameters;
    private parametersUpdated = new Subject<BarChartStateParameters>();

    getParametersUpdateListener(){
        return this.parametersUpdated.asObservable();
    }

    getParameters(){
        return this.parameters;
    }

    updateParameters(newParameters:BarChartStateParameters){
        console.log("called")
        this.parameters = newParameters;
        this.parametersUpdated.next(this.parameters);
    }

    
}