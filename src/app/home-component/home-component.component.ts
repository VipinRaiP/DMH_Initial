import { Component, OnInit } from '@angular/core';
import {Router } from '@angular/router';
import {BarChartAllDistParameters} from "../model/barchartAllDistParameters.model";
import { BarChartAllDistService } from '../services/barchartAllDist.service';


@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private router:Router,private barchartService:BarChartAllDistService){

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
      }
      this.barchartService.updateParameters(parameters);
    }
    else if(parameterType=="SuicideCases"){  
      parameters =  {
        yLabel : "Suicide Cases",
        data : "getSuicideDataAllDist",
        threshold : 3000,
        columnName : "SuicideCases",
      }
      this.barchartService.updateParameters(parameters);
    }
    //this.router.navigate(['/barChartAllDist']);
    
  }

}
