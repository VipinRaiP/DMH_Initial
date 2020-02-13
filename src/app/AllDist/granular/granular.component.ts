import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import { HttpClient } from '@angular/common/http';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChildActivationStart } from '@angular/router';
import { BarChartAllDistService } from 'src/app/services/barchartAllDist.service';
import { BarChartAllDistParameters } from 'src/app/model/barchartAllDistParameters.model';
import { BarChartAllDistDataReq } from 'src/app/model/barchartAllDistDataReq.model';

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
  selector: 'app-granular',
  templateUrl: './granular.component.html',
  styleUrls: ['./granular.component.css'],
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
export class GranularComponent implements OnInit {

  private year: number = new Date().getFullYear();
  private quarterData: any;
  private monthlyData: any;
  private annualData: any;
  private quarterChoosen: number = 1;
  private monthChoosen: number = 1;
  private months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  private monthName = "Jan";
  private displayMonthData = false;
  private displayQuarterData = false;
  private granularChoosen: number = 1; // Granualirity : 1: Annual , 2 : Month , 3: Quarter
  private parameter: string;
  private chartParameters: BarChartAllDistParameters;

  @Input()
  dataURL: any;

  @Output()
  data: any;
  @Output()
  yearChange = new EventEmitter<any>()

  constructor(private http: HttpClient, private barChartService: BarChartAllDistService, ) { }

  ngOnInit() {
    console.log("All dist Granular loaded");
    let newDataReq:BarChartAllDistDataReq;
    newDataReq  = this.barChartService.getDataReq();
    this.processDataRequest(newDataReq);
    // Subscribe for further data requests from onsubmit or drill downs

    this.barChartService.getDataReqListener().subscribe((newDataReq) => {
        this.processDataRequest(newDataReq);
    })
  
  }

  /* *********************************************************************************************************************
   * Setting the inputs from user 
   *
   * ********************************************************************************************************************/

  onMonthChange(event: any) {
    this.monthChoosen = event.value;
    this.monthName = this.months[this.monthChoosen - 1];
    console.log("Month changed");
    console.log(event.value);
    this.updateData();
  }

  onQuarterChange(event: any) {
    console.log("Quarter changed " + event.value);
    this.quarterChoosen = event.value;
    this.updateData();
  }

  onGranularChange(event: any) {
    console.log("Granular changed" + event.value)
    this.granularChoosen = +event.value;
    switch (this.granularChoosen) {
      case 2:
        console.log("choosed")
        this.displayMonthData = true;
        this.displayQuarterData = false;
        break;
      case 3:
        this.displayMonthData = false;
        this.displayQuarterData = true;
        break;
      case 1:
        this.displayMonthData = false;
        this.displayQuarterData = false;
    }
    this.quarterChoosen = 1;
    this.monthChoosen = 1;
    this.monthName = "Jan";
    this.updateData();
  }

  /* *********************************************************************************************************************
   * Get the monthly quarterly and annual data for a year selected  
   *
   *  
   * *********************************************************************************************************************/


  getYearData(year: number) {
    console.log(year)
    let postData = {
      year: year
    }
    this.http.post<any>("http://localhost:3000/" + this.dataURL['Annual'], postData)
      .subscribe(responseData => {
        console.log("Data received " + year);
        console.log(responseData);
        this.annualData = responseData;
      })

    this.http.post<any>("http://localhost:3000/" + this.dataURL['Quarter'], postData)
      .subscribe(responseData => {
        console.log("Data received");
        console.log(responseData);
        this.quarterData = responseData;
      })

    this.http.post<any>("http://localhost:3000/" + this.dataURL['Monthly'], postData)
      .subscribe(responseData => {
        console.log("Data received");
        console.log(responseData);
        this.monthlyData = responseData;
        this.updateData();
      })
  }

  private yearObj = new FormControl(moment());

  choosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    console.log("year called : " + normalizedYear.year())
    //this.radioPresent=!this.radioPresent;
    const ctrlValue = this.yearObj.value;
    ctrlValue.year(normalizedYear.year());
    this.yearObj.setValue(ctrlValue);
    datepicker.close();
    this.year = normalizedYear.year();
    this.annualData = [];
    this.monthlyData = [];
    this.quarterData = [];
    this.getYearData(this.year);
  }

  getMonthData() {
    console.log(this.monthlyData)
    //this.monthChoosen = 6;
    return (this.monthlyData[this.monthChoosen] == null) ? [] : this.monthlyData[this.monthChoosen];
  }

  getQuarterData() {
    return (this.quarterData[this.quarterChoosen] == null) ? [] : this.quarterData[this.quarterChoosen];
  }

  /* *********************************************************************************************************************
  *  Update the data as per granualarity
  *
  *  
  * *********************************************************************************************************************/

  updateData() {

    if (this.granularChoosen == 1) {
      /* Annual */
      this.data = this.annualData;
      console.log("Annual data");
      console.log(this.data);
    }
    else if (this.granularChoosen == 2) {
      /* Monthly */
      console.log("Montly data for " + this.monthChoosen);
      console.log(this.monthlyData);
      this.data = this.getMonthData();
      console.log(this.data);
    }
    else if (this.granularChoosen == 3) {
      /* Quarterly */
      console.log("Quarter data for " + this.quarterChoosen);
      console.log(this.quarterData);
      this.data = this.getQuarterData();
      console.log(this.data)
    }
    /*this.yearChange.emit({
      data: this.data,
      year: this.year
    });*/
    let sendingData = {
      year: this.year,
      granular: this.granularChoosen,
      choosenValue: (this.granularChoosen == 1) ? this.year : (this.granularChoosen == 2) ? this.monthChoosen : this.quarterChoosen,
      data: this.data,
    }
    this.barChartService.updateChartData(sendingData);
  }

  /**********************************************************************************************************************************
 * 
 *  Resolve Chart Parameters 
 * 
 **********************************************************************************************************************************/

  resolveChartParameter(parameterNumber: number) {
    if (parameterNumber == 1) {
      this.dataURL = {
        Annual: "getAlcoholDataAllDistAnnually",
        Quarter: "getAlcoholDataAllDistQuart",
        Monthly: "getAlcoholDataAllDistMonthly"
      }
      return {
        yLabel: "Alcohol Cases",
        data: "getAlcoholDataAllDist",
        threshold: 3000,
        columnName: "AlcoholCases"
      }
    }
    else if (parameterNumber == 2) {
      console.log("getting urls")
      this.dataURL = {
        Annual: "getSuicideDataAllDistAnnually",
        Quarter: "getSuicideDataAllDistQuart",
        Monthly: "getSuicideDataAllDistMonthly"
      }
      return {
        yLabel: "Suicide Cases",
        data: "getSuicideDataAllDist",
        threshold: 3000,
        columnName: "SuicideCases" 
      }
    }
  }

  /* *****************************************************************************************************************************
   *  Process Data requests
   * 
   * ****************************************************************************************************************************/

  processDataRequest(newDataReq) {
    console.log("District granualar : Data req received")
    console.log(newDataReq)
    // Update chart parameters
    this.chartParameters = this.resolveChartParameter(newDataReq.parameterNumber);
    this.barChartService.updateParameters(this.chartParameters);
    
    if (!newDataReq.onSubmit) {
      this.year = newDataReq.year;
      this.granularChoosen = newDataReq.granular;
      if (newDataReq.granular == 2)
        this.monthChoosen = newDataReq.choosenValue;
      else if (newDataReq.granular == 3)
        this.quarterChoosen = newDataReq.choosenValue;
    }
    this.getYearData(this.year);
  }
}



