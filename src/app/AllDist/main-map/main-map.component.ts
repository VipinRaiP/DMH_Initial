import { Component, OnInit,ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
import { BarChartAllDistService } from 'src/app/services/barchartAllDist.service';
import { BarChartAllDistParameters } from 'src/app/model/barchartAllDistParameters.model';
import { Title } from '@angular/platform-browser';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { MapDetailsComponent } from '../map-details/map-details.component';
import { MapService } from './main-map.service';

@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.svg',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent implements OnInit {

  // @ViewChild('Haveri', { static: true }) private chartContainer: ElementRef;

 // private mysore : District = new District("Mysore"," ",0,"");

  @Input() viewBoxDims:string ;//= "1500 -2000 22000 30700";

  private mapElement: any;  
  private year:number;
  mycolor1 = "red";
  mycolor2 = "green";
  tooltipText = "HtmlContent:name <br> cases: 5566";
  public newData :any = {};

  private data:any;
  private parameterNumber:number;

  public chartParameters:BarChartAllDistParameters;

  constructor(private http:HttpClient,private mapService : MapService,
              private barChartService:BarChartAllDistService,
              private titleService:Title,
              public dialog: MatDialog) { }

  ngOnInit() {

    console.log("All dist map loaded")
    this.initialiseColor();

    this.chartParameters = this.barChartService.getParameters();

    this.barChartService.getParametersUpdateListener().subscribe( (newParameter)=>{
      console.log(" All dist map  : parameter received");
      console.log(newParameter);
      this.chartParameters = newParameter;
      this.titleService.setTitle(this.chartParameters.yLabel);
  })

  this.barChartService.getChartDataListener().subscribe((newData) => {
    console.log(" All Dist map: Data update received");
    console.log(newData);
    this.data = newData.data;
    this.year = newData.year;
    this.parameterNumber = newData.parameterNumber;
    //this.granular = newData.granular;
    //localStorage.setItem("granular_allDist",newData.granular+"");
    //this.choosenValue = newData.choosenValue;
    //if (this.granular == 2)
    //  this.monthName = this.months[this.choosenValue-1];
    this.updateMapColors(this.data);
  })


    /*this.mapService.onYearChanged.subscribe(
      (year:number) =>{
        this.getData(year);
      }
    )*/

  }

/*
  getData(nyear:number)
  {
    let postData = {
      year: nyear,
    }
    this.http.post<any>("http://localhost:3000/getAlcoholYearlyDistrictforMap", postData)
    .subscribe(responseData => {
     console.log("Year Data received");
     console.log(responseData);
     this.updateMapColors(responseData) 
    })
  }
  */

  updateMapColors(mapData)
  {
    this.initialiseColor();
    console.log("Map received data");
    console.log(mapData);
    console.log("All Dist Map : ycolumn  = "+ this.chartParameters.yColumnName); 
      for(var data of mapData)
      {
        let color;
        
          if(data[this.chartParameters.yColumnName] < this.chartParameters.threshold)
          {
            color = "#008000"
          }
          else if(data[this.chartParameters.yColumnName] >this.chartParameters.threshold && data[this.chartParameters.yColumnName] < this.chartParameters.threshold+1000)
          {
            color = "#ff1a1a"
            //color = "#ff6666"
          }
          else
          {
            color = "#cc0000";
          }


        if(data.District == "Haveri")
        {
          this.newData["Haveri"] = color;
        }
        else if (data.District == "Davanagere")
        {
          this.newData["Davanagere"] = color;
        }
        else if (data.District == "Koppal")
        {
          this.newData["Koppal"] = color;
        }
        else if (data.District == "Bellary")
        {
          this.newData["Bellary"] = color;
        }
        else if (data.District == "Belgaum")
        {
          this.newData["Belgaum"] = color;
        }
        else if (data.District == "Gadag")
        {
          this.newData["Gadag"] = color;
        }
        else if (data.District == "Dharwad")
        {
          this.newData["Dharwad"] = color;
        }
        else if (data.District == "Bagalkote")
        {
          this.newData["Bagalkote"] = color;
        }
        else if (data.District  == "Udupi")
        {
          this.newData["Udupi"] = color;
        }
        else if (data.District == "Uttara Kannada")
        {
          this.newData["Uttara_Kannada"] = color;
        }
        else if (data.District == "Shimoga")
        {
          this.newData["Shimoga"] = color;
        }
        else if (data.District == "Tumkur")
        {
          this.newData["Tumkur"] = color;
        }
        else if (data.District == "Chikmagalur")
        {
          this.newData["Chikmagalur"] = color;
        }
        else if (data.District == "Chitradurga")
        {
          this.newData["Chitradurga"] = color;
        }
        else if (data.District == "Kodagu")
        {
          this.newData["Kodagu"] = color;
        }
        else if (data.District == "Dakshina Kannada")
        {
          this.newData["Dakshina_Kannada"] = color;
        }
        else if (data.District == "Hassan")
        {
          this.newData["Hassan"] = color;
        }
        else if (data.District == "Uttara Kannada")
        {
          this.newData["Uttara_Kannada"] = color;
        }
        else if (data.District == "Chamrajnagar")
        {
          this.newData["Chamrajnagar"] = color;
        }
        else if (data.District == "Mysore")
        {
          this.newData["Mysore"] = color;
        }
        else if (data.District == "Mandya")
        {
          this.newData["Mandya"] = color;
        }
        else if (data.District == "Bangalore Urban")
        {
          this.newData["Bangalore_Urban"] = color;
        }
        else if (data.District == "Ramanagar")
        {
          this.newData["Ramanagara"] = color;
        }
        else if (data.District == "Kolar")
        {
          this.newData["Kolar"] = color;
        }
        else if (data.District == "Bangalore Rural")
        {
          this.newData["Bangalore_Rural"] = color;
        }
        else if (data.District == "Chikkaballapur")
        {
          this.newData["Chikkaballapur"] = color;
        }
        else if (data.District == "Yadgir")
        {
          this.newData["Yadgir"] = color;
        }
        else if (data.District == "Raichur")
        {
          this.newData["Raichur"] = color;
        }
        else if (data.District == "Bijapur")
        {
          this.newData["Bijapur"] = color;
        }
        else if (data.District == "Bidar")
        {
          this.newData["Bidar"] = color;
        }
        else if (data.District == "Gulbarga")
        {
          this.newData["Gulbarga"] = color;
        }


      }

      console.log(this.newData);
  }

  displayName(name) {

    this.tooltipText = "Name: " + name +"<br>" + "Cases: 2000 " ;
    //console.log(name);
    // document.getElementById('country-name').firstChild.data = name;
}


districtSelected(district){
  let emitData = {
    district : district,
    yColumnName : this.chartParameters.yColumnName,
    parameterNumber : this.parameterNumber,
    year: this.year
  }
  this.mapService.onDistrictSelected.emit(emitData);
}

initialiseColor()
{
 
  let color = "#808080";

          this.newData["Haveri"] = color;
      
          this.newData["Davanagere"] = color;
       
          this.newData["Koppal"] = color;
        
          this.newData["Bellary"] = color;
       
          this.newData["Belgaum"] = color;
       
          this.newData["Gadag"] = color;
        
          this.newData["Dharwad"] = color;
        
          this.newData["Bagalkote"] = color;
       
          this.newData["Udupi"] = color;
       
          this.newData["Uttara_Kannada"] = color;
       
          this.newData["Shimoga"] = color;
       
          this.newData["Tumkur"] = color;
       
          this.newData["Chikmagalur"] = color;
       
          this.newData["Chitradurga"] = color;
        
          this.newData["Kodagu"] = color;
       
          this.newData["Dakshina_Kannada"] = color;
        
          this.newData["Hassan"] = color;
        
          this.newData["Uttara_Kannada"] = color;
       
          this.newData["Chamrajnagar"] = color;
       
          this.newData["Mysore"] = color;
       
          this.newData["Mandya"] = color;
        
          this.newData["Bangalore_Urban"] = color;
       
          this.newData["Ramanagara"] = color;
        
          this.newData["Kolar"] = color;
       
          this.newData["Bangalore_Rural"] = color;
        
          this.newData["Chikkaballapur"] = color;
       
          this.newData["Yadgir"] = color;
       
          this.newData["Raichur"] = color;
        
          this.newData["Bijapur"] = color;
        
          this.newData["Bidar"] = color;
        
          this.newData["Gulbarga"] = color;
   
}

}
