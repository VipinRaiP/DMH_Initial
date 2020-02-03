import { Component, OnInit, OnDestroy } from '@angular/core';
import { LineChartPerDistService } from '../../services/lineChartPerDist.service';
import { LineChartPerDistParameters } from '../../model/linechartPerDistParameters.model';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BarChartAllDistParameters } from '../../model/barchartAllDistParameters.model';
import { BarChartAllDistService } from '../../services/barchartAllDist.service';

@Component({
  selector: 'app-all-dist-menu',
  templateUrl: './all-dist-menu.component.html',
  styleUrls: ['./all-dist-menu.component.css']
})
export class AllDistMenuComponent implements OnInit,OnDestroy {
  private paramNumber:number = 0;
  private params = Array(3);
  private parameterType;

  constructor(private barchartService: BarChartAllDistService, private router: Router) { }

  ngOnInit() {
    if(localStorage.getItem('paramNumber')!=null)
      this.paramNumber = +localStorage.getItem('paramNumber');
    this.barchartService.updateParameters({
      yLabel: "Alcohol Cases",
      data: "getAlcoholDataAllDist",
      threshold: 3000,
      columnName: "AlcoholCases",
      dataURL: {
        Annual: "getAlcoholDataAllDistAnnually",
        Quarter: "getAlcoholDataAllDistQuart",
        Monthly: "getAlcoholDataAllDistMonthly"
      }});   
  }

  onSubmit(form: NgForm) {
    let parameters: BarChartAllDistParameters;
    this.parameterType = form.value.parameter;
    console.log(this.parameterType);

    if (this.parameterType == "") {
      console.log("parameter updating alcohol")
      parameters = {
        yLabel: "Alcohol Cases",
        data: "getAlcoholDataAllDist",
        threshold: 3000,
        columnName: "AlcoholCases",
        dataURL: {
          Annual: "getAlcoholDataAllDistAnnually",
          Quarter: "getAlcoholDataAllDistQuart",
          Monthly: "getAlcoholDataAllDistMonthly"
        }
      }
      this.paramNumber = 1;
      this.barchartService.updateParameters(parameters);
    }
    else if (this.parameterType == "SuicideCases") {
      parameters = {
        yLabel: "Suicide Cases",
        data: "getSuicideDataAllDist",
        threshold: 3000,
        columnName: "SuicideCases",
        dataURL: {
          Annual: "getSuicideDataAllDistAnnually",
          Quarter: "getSuicideDataAllDistQuart",
          Monthly: "getSuicideDataAllDistMonthly"
        }
      }
      this.paramNumber = 2;
      this.barchartService.updateParameters(parameters);
    }
    //this.router.navigate(["allDist/barChart"]);
  }

  /* Resolve parameters */

  resolvePerDistParameter(districtId, parameter) {
    if (parameter == "alcoholCases") {
      return {
        yLabel: "Alcohol Cases",
        data: "getAlcoholDataPerDist",
        threshold: 30,
        columnName: "AlcoholCases",
        districtId: districtId,
        year: 2018
      }
    }
    if (parameter == "suicideCases") {
      return {
        yLabel: "Suicide Cases",
        data: "getSuicideDataPerDist",
        threshold: 6,
        columnName: "SuicideCases",
        districtId: districtId,
        year: 2018
      }
    }
  }

  ngOnDestroy(){
    localStorage.setItem("paramNumber",this.paramNumber+'');
  }

}

