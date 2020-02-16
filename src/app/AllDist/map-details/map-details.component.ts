import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import { HttpClient } from '@angular/common/http';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MapService } from '../main-map/main-map.service';

/* Adding new comments in branch version 1 */
const moment = _rollupMoment || _moment; _moment;

/* For Date picker year */

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-map-details',
  templateUrl: './map-details.component.html',
  styleUrls: ['./map-details.component.css'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    
  ]
})
export class MapDetailsComponent implements OnInit {
  private year: number = new Date().getFullYear();
  private quarterData: any;
  private monthlyData: any;
  private annualData: any;
  private districtSelected : String;
  private janData:string;
  private febData:string;
  private marData:string;
  private aprData:string;
  private mayData:string;
  private juneData:string;
  private julyData:string;
  private augData:string;
  private septData:string;
  private octData:string;
  private novData:string;
  private decData:string;
  
  private quat1Data:string;
  private quat2Data:string;
  private quat3Data:string;

  private yearData:string;


  constructor(private http:HttpClient,private mapService : MapService) { 
   
  }

  ngOnInit() {
    this.initializeMonthlyData();
    this.initializeQuarterlyData();
    this.initializeYearlyData();
    this.mapService.onDistrictSelected.subscribe(
      (districtName:String) =>{
        this.districtSelected = districtName;
        console.log(this.districtSelected);
        this.getYearData(this.year,this.districtSelected);
        //this.updateData(this.monthlyData);
      }
    )
  }

  private yearObj = new FormControl(moment());

  choosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.yearObj.value;
    ctrlValue.year(normalizedYear.year());
    this.yearObj.setValue(ctrlValue);
    datepicker.close();
     this.year = normalizedYear.year();
     this.mapService.onYearChanged.emit(this.year);
    this.getYearData(this.year,this.districtSelected);
    //this.updateData(this.monthlyData);
  }

  getYearData(year: number,district : String) {
    console.log(year)
    let postData = {
      year: year,
      district: district
    }
  
    
    this.http.post<any>("http://localhost:3000/getAlcoholMonthlyperDistrictforMap", postData)
      .subscribe(responseData => {
        console.log("Data received");
       console.log(responseData);
       this.initializeMonthlyData();
       this.updateMonthlyData(responseData);
        this.monthlyData = responseData;
        //this.updateData();
      })

      this.http.post<any>("http://localhost:3000/getAlcoholQuarterlyperDistrictforMap", postData)
      .subscribe(responseData => {
        console.log("Data received");
       console.log(responseData);
       this.initializeQuarterlyData();
       this.updateQuarterData(responseData);
        //this.monthlyData = responseData;
        //this.updateData();
      })
      
      this.http.post<any>("http://localhost:3000/getAlcoholYearlyperDistrictforMap", postData)
      .subscribe(responseData => {
        console.log("Data received");
       console.log(responseData);
       this.initializeYearlyData();
       this.updateYearData(responseData);
        //this.monthlyData = responseData;
        //this.updateData();
      })
  }

  updateMonthlyData(monthlyData)
  {
    console.log("Executed");
    if(monthlyData!=null)
    {
        for(var data of monthlyData)
        {
         
          if(data.month == 1)
          {
              this.janData = data.total_alcohol_cases;
          }
          else if(data.month == 2)
          {
              this.febData = data.total_alcohol_cases;
          }
          else if(data.month == 3)
          {
              this.marData = data.total_alcohol_cases;
          } 
          else if(data.month == 4)
          {
              this.aprData = data.total_alcohol_cases;
          } 
          else if(data.month == 5)
          {
              this.mayData = data.total_alcohol_cases;
          }  
          else if(data.month == 6)
          {
              this.juneData = data.total_alcohol_cases;
          } 
          else if(data.month == 7)
          {
              this.julyData = data.total_alcohol_cases;
          } 
          else if(data.month == 8)
          {
              this.augData = data.total_alcohol_cases;
          } 
          else if(data.month == 9)
          {
              this.septData = data.total_alcohol_cases;
          } 
          else if(data.month == 10)
          {
              this.octData = data.total_alcohol_cases;
          } 
          else if(data.month == 11)
          {
              this.novData = data.total_alcohol_cases;
          } 
          else if(data.month == 12)
          {
              this.decData = data.total_alcohol_cases;
          } 

        
        }
    }
  }

  updateQuarterData(quarterlyData){

    if(quarterlyData != null)
    {
      for(var qdata of quarterlyData)
      {
        if(qdata.Quarter == 1)
        {
            this.quat1Data = qdata.AlcoholCases;
        }
        else if(qdata.Quarter == 2 )
        {
            this.quat2Data = qdata.AlcoholCases;
        }
        else if(qdata.Quarter == 3)
        {
            this.quat3Data = qdata.AlcoholCases;
        }
      }
    }

  }

  updateYearData(yearlyData){
   console.log("YEAR DATA "+yearlyData);
    if(yearlyData != null)
    {
      for(var ydata of yearlyData)
      {
        this.yearData = ydata.total_alcohol_cases;
      }
    }
  }

  initializeMonthlyData(){
  this.janData = "No Data Available";   
  this.febData = "No Data Available";   
  this.marData = "No Data Available";   
  this.aprData = "No Data Available";   
  this.mayData = "No Data Available";   
  this.juneData = "No Data Available";   
  this.julyData = "No Data Available";   
  this.augData = "No Data Available";   
  this.septData = "No Data Available";   
  this.octData = "No Data Available";   
  this.novData = "No Data Available";   
  this.decData = "No Data Available";   
  }

  initializeQuarterlyData(){
    this.quat1Data = "No Data Available";
    this.quat2Data = "No Data Available";
    this.quat3Data = "No Data Available";
  }
  initializeYearlyData(){
    this.yearData = "No Data Available";
  }
}
