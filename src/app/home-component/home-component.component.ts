import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import {BarChartAllDistParameters} from "../model/barchartAllDistParameters.model";
import { BarChartAllDistService } from '../services/barchartAllDist.service';
import {FormBuilder, NgForm} from '@angular/forms';
import { LineChartPerDistService } from '../services/lineChartPerDist.service';
import { LineChartPerDistParameters } from '../model/linechartPerDistParameters.model';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private router:Router,private barchartService:BarChartAllDistService,
              private linechartPerDistService:LineChartPerDistService){

  }

  onClick(parameterType){
    let parameters: BarChartAllDistParameters;
    console.log(parameterType); 

    if(parameterType=="AlcoholCases"){
      console.log("parameter updating")
      parameters =  {
        yLabel : "Alcohol Cases",
        data : "getAlcoholDataAllDist",
        threshold : 3000,
        columnName : "AlcoholCases",
        dataURL :   {
          Annual:"getAlcoholDataAllDistAnnually",
          Quarter: "getAlcoholDataAllDistQuart",
          Monthly:"getAlcoholDataAllDistMonthly"
          }
      }
      this.barchartService.updateParameters(parameters);
    }
    else if(parameterType=="SuicideCases"){  
      parameters =  {
        yLabel : "Suicide Cases",
        data : "getSuicideDataAllDist",
        threshold : 3000,
        columnName : "SuicideCases",
        dataURL: {
          Annual:"getSuicideDataAllDistAnnually",
          Quarter: "getSuicideDataAllDistQuart",
          Monthly:"getSuicideDataAllDistMonthly"
        }
      }
      this.barchartService.updateParameters(parameters);
    }
    //this.router.navigate(['/barChartAllDist']); 
  }

  onSubmitPerDist(form:NgForm){
    let linechartParameters: LineChartPerDistParameters;
    console.log(+form.value.districtId);
    linechartParameters = this.resolvePerDistParameter(+form.value.districtId,form.value.parameter);   
    this.linechartPerDistService.updateParameters(linechartParameters);
    this.router.navigate(["lineChartPerDist"]);
  }

  /* Resolve parameters */

resolvePerDistParameter(districtId,parameter){
  if(parameter=="alcoholCases"){
    return {
      yLabel : "Alcohol Cases",
      data : "getAlcoholDataPerDist",
      threshold : 30,
      columnName : "AlcoholCases",
      districtId: districtId,
      district:null,
      year:2018
    }
  }
  if(parameter=="suicideCases"){
    return {
      yLabel : "Suicide Cases",
      data : "getSuicideDataPerDist",
      threshold : 6,
      columnName : "SuicideCases",
      districtId: districtId,
      district:null,
      year:2018
    }
  }
}
}
