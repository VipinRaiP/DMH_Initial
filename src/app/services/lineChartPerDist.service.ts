
import { LineChartPerDistParameters } from '../model/linechartPerDistParameters.model';
import { Subject } from 'rxjs';


export class LineChartPerDistService{
    private parameters:LineChartPerDistParameters;
    private parametersUpdated = new Subject<LineChartPerDistParameters>();

    getParametersUpdateListener(){
        return this.parametersUpdated.asObservable();
    }

    getParameters(){
        return this.parameters;
    }

    updateParameters(newParameters:LineChartPerDistParameters){
        console.log("called")
        this.parameters = newParameters;
        this.parametersUpdated.next(this.parameters);
    }
}