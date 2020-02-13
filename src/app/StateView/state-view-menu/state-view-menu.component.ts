import { Component, OnInit, OnDestroy } from '@angular/core';
import { BarChartStateParameters } from 'src/app/model/barChartStateParameters.model';
import { NgForm } from '@angular/forms';
import { BarChartStateService } from 'src/app/services/bar-chart-state.service';
import { BarChartStateDataReq } from 'src/app/model/barChartStateDataReq.model';


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
    /* create a new data request */
    console.log("State chart menu loaded")
    let newDataReq:BarChartStateDataReq = {
      onSubmit : true,
      granular :1,
      choosenValue: 2017,
      year: 2017,
      parameterNumber : 1
    }
    this.barChartService.createDataReq(newDataReq);
  }

  onSubmit(form: NgForm) {
    
    this.paramNumber = (form.value.parameter=="")?1:form.value.parameter;
    console.log("State chart : choosen value : "+ this.paramNumber);
    let newDataReq:BarChartStateDataReq = {
      onSubmit : true,
      granular :1,
      choosenValue: 2017,
      year: 2017,
      parameterNumber : this.paramNumber
    }
    this.barChartService.createDataReq(newDataReq);
  }

  ngOnDestroy(): void {
  }

}  