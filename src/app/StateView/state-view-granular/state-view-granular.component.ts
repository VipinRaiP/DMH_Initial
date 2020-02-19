import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import { HttpClient } from '@angular/common/http';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ChildActivationStart } from '@angular/router';
import { BarChartStateService } from 'src/app/services/bar-chart-state.service';

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
  selector: 'app-state-view-granular',
  templateUrl: './state-view-granular.component.html',
  styleUrls: ['./state-view-granular.component.css'],
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
export class StateViewGranularComponent implements OnInit {
  public minYear: number = 2017;
  public maxYear: number = new Date().getFullYear();
  private annualData: any;
  public quarterChoosen: number = 1;
  private monthChoosen: number = 1;
  private monthName = "Jan";
  public parameterName:string;

  private parameterNumber: number; // type of parameter : alcohol, suicide
  private dataURL: {
    Year: string,
    Month: string,
    Quarter: string,
  }
  public granularChoosen: number = 1; // Granualirity : 1: Annual , 2 : Month , 3: Quarter
  public year: number = 2018;
  private quarterData: any;
  private monthlyData: any;
  private yearData: any;
  private dataRequests: number = 0;

  public xColumnName:string = "Year";

  @Output()
  data: any;
  @Output()
  granularChange = new EventEmitter<any>()

  constructor(private http: HttpClient, private barChartService: BarChartStateService) { }

  ngOnInit() {
    console.log("State Granular loaded..");
    this.dataRequests = 0;
    // On new data request update chart parameters and data
    let newDataReq = this.barChartService.getDataReq();
    this.processDataRequests(newDataReq);
    this.barChartService.getDataReqListener().subscribe((newDataReq) => {
      this.processDataRequests(newDataReq);
    })
  }

  /* *********************************************************************************************************************
   * Setting the inputs from user 
   *
   * ********************************************************************************************************************/

  onYearChange(event: any) {
    this.monthChoosen = event.value;
    console.log(event.value);
    this.year = event.value;
    this.updateData();
  }

  onGranularChange(event: any) {
    console.log("Granular changed" + event.value)
    this.granularChoosen = +event.value;
    this.xColumnName = (this.granularChoosen == 1) ? "Year" : (this.granularChoosen == 2) ? "Month" : "Quarter";
    this.updateData();
  }

  /* *********************************************************************************************************************
   * Get state data yeary, monthly and quarterly
   *
   *  
   * *********************************************************************************************************************/

  getData() {
    this.http.get<any>("http://localhost:3000/" + this.dataURL['Year'])
      .subscribe(responseData => {
        console.log("year Data received");
        console.log(responseData);
        this.yearData = responseData;
      })
    this.http.get<any>("http://localhost:3000/" + this.dataURL['Month'])
      .subscribe(responseData => {
        console.log("month Data received");
        console.log(responseData);
        this.monthlyData = responseData;
      })
    this.http.get<any>("http://localhost:3000/" + this.dataURL['Quarter'])
      .subscribe(responseData => {
        console.log("quarter  Data received");
        console.log(responseData);
        this.quarterData = responseData;
        this.updateData();
      })
  }

  getMonthData() {
    console.log(this.monthlyData)
    //this.monthChoosen = 6;
    return (this.monthlyData[this.year] == null) ? [] : this.monthlyData[this.year];
  }

  getQuarterData() {
    return (this.quarterData[this.year] == null) ? [] : this.quarterData[this.year];
  }

  /* *********************************************************************************************************************
  *  Update the data as per granualarity
  *
  *  
  * *********************************************************************************************************************/

  updateData() {
    console.log("State granular : Updating data")
    if (this.granularChoosen == 1) {
      /* Annual */
      this.data = this.yearData;
      console.log("Year data");
      console.log(this.year);
      console.log(this.data);
    }
    else if (this.granularChoosen == 2) {
      /* Monthly */
      //console.log("Montly data for " + this.monthChoosen);
      const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', "Sep", 'Oct', 'Nov', 'Dec'];
      console.log("Month data");
      console.log(this.monthlyData);
      this.data = JSON.parse(JSON.stringify(this.getMonthData()));
      this.data.forEach((d) => {
        d['Month'] = month[d['Month'] - 1];
      })
      console.log(this.data);
    }
    else if (this.granularChoosen == 3) {
      /* Quarterly */
      console.log("Quarter data");
      console.log(this.quarterData);
      // to avoid copying reference 
      this.data = JSON.parse(JSON.stringify(this.getQuarterData()));
      this.data.forEach((d) => {
        d['Quarter'] = (d['Quarter'] == 1) ? 'Q1' : (d['Quarter'] == 2) ? 'Q2' : (d['Quarter'] == 3) ? 'Q3' : 'Q4';
      })
      console.log(this.data)
    }
    this.barChartService.updateChartData({
      data: this.data,
      year: this.year,
      granular: this.granularChoosen,
      xColumnName: (this.granularChoosen == 1) ? "Year" : (this.granularChoosen == 2) ? "Month" : "Quarter"
    });
  }

  /* *****************************************************************************************************************************
   *  Resolve state bar chart parameters
   *  
   * *****************************************************************************************************************************/

  resolveChartParameters(paramNumber: number) {
    this.parameterName = this.resolveParameterName(paramNumber);
    console.log("New parameter name : " + this.parameterName)
    if (this.parameterNumber != paramNumber)
      this.dataRequests = 0;
    if (paramNumber == 1) {
      this.dataURL = {
        Month: "getStateAlcoholDataMonthly",
        Year: "getStateAlcoholDataYearly",
        Quarter: "getStateAlcoholDataQuart"
      }
      return {
        yLabel: "Alcohol Cases",
        threshold: 20000,
        yColumnName: this.parameterName,
        parameterNumber: paramNumber
      }
    }
    else if (paramNumber == 2) {
      this.dataURL = {
        Year: "getStateSuicideDataYearly",
        Quarter: "getStateSuicideDataQuart",
        Month: "getStateSuicideDataMonthly"
      }
      return {
        yLabel: "Suicide Cases",
        threshold: 3000,
        yColumnName: this.parameterName,
        parameterNumber: paramNumber
      }
    }
  }

  /* *****************************************************************************************************************************
 *  Process new data requests
 *  
 * *****************************************************************************************************************************/

  processDataRequests(newDataReq) {
    console.log("State granular: Processing data request " + (this.dataRequests + 1))
    if (!newDataReq.onSubmit) {
      this.year = newDataReq.year;
      this.granularChoosen = newDataReq.granular;
      if (newDataReq.granular == 2)
        this.monthChoosen = newDataReq.choosenValue;
      else if (newDataReq.granular == 3)
        this.quarterChoosen = newDataReq.choosenValue;
    }
    let newChartParameters = this.resolveChartParameters(newDataReq.parameterNumber);
    this.parameterNumber = newDataReq.parameterNumber;
    this.barChartService.updateParameters(newChartParameters);
    if (this.dataRequests == 0)
      this.getData();
    else
      this.updateData();
    this.dataRequests += 1;
  }

  /* ******************************************************************************************************************************
   *  Resolve parameter name
   * 
   * *****************************************************************************************************************************/

  resolveParameterName(parameterNumber) {
    switch (+parameterNumber) {
      case 1:
        return 'Alcohol Cases';
        break;
      case 2:
        console.log("Suicide cases case")
        return 'Suicide Cases';
        break;
    }
  }



}
