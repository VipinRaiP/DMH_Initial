import { Component, OnInit, OnDestroy } from '@angular/core';
import { BarChartStateParameters } from 'src/app/model/barChartStateParameters.model';
import { NgForm } from '@angular/forms';
import { BarChartStateService } from 'src/app/services/bar-chart-state.service';


@Component({
  selector: 'app-state-view-menu',
  templateUrl: './state-view-menu.component.html',
  styleUrls: ['./state-view-menu.component.css']
})
export class StateViewMenuComponent implements OnInit,OnDestroy {
  

  private paramNumber: number = 0;
  private parameterType: any;

  constructor(private barChartService: BarChartStateService) { }

  ngOnInit() {
      this.barChartService.updateParameters(this.resolveParams(this.paramNumber)); 
  }

  onSubmit(form: NgForm) {
    let parameters: BarChartStateParameters;
    this.paramNumber = form.value.parameter;
    console.log(this.paramNumber);

    this.barChartService.updateParameters(this.resolveParams(this.paramNumber));
  }

  resolveParams(paramNumber: number) {
    if (paramNumber == 1) {
      return {
        yLabel: "Alcohol Cases",
        threshold: 20000,
        yColumnName: "AlcoholCases", 
        dataURL: {
          parameterNumber: 1,
          Month: "getStateAlcoholDataMonthly",
          Year: "getStateAlcoholDataYearly",
          Quarter: "getStateAlcoholDataQuart"
        }
      }
    }
    else if (paramNumber == 2) {
      return {
        yLabel: "Suicide Cases",
        threshold: 3000,
        yColumnName: "SuicideCases",
        dataURL: {
          parameterNumber : 2, 
          Year: "getStateSuicideDataYearly",
          Quarter: "getStateSuicideDataQuart",
          Month: "getStateSuicideDataMonthly"
        }
      }
    }
  }

  ngOnDestroy(): void {
  }

}  