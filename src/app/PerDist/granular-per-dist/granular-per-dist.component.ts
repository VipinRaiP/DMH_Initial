import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { HttpClient } from '@angular/common/http';


import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { LineChartPerDistService } from 'src/app/services/lineChartPerDist.service';
import { AreaChartPerDistService } from 'src/app/services/areaChartPerDist.service';


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
  selector: 'app-granular-per-dist',
  templateUrl: './granular-per-dist.component.html',
  styleUrls: ['./granular-per-dist.component.css'],
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
export class GranularPerDistComponent implements OnInit {
  @Output()
  private yearChange = new EventEmitter<any>();

  private year: number;

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }

  /* On year change */

  private yearObj = new FormControl(moment());

  choosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    console.log("year called : " + normalizedYear.year())
    //this.radioPresent=!this.radioPresent;
    const ctrlValue = this.yearObj.value;
    ctrlValue.year(normalizedYear.year());
    this.yearObj.setValue(ctrlValue);
    datepicker.close();
    this.year = normalizedYear.year();
    this.yearChange.emit(this.year);
  }

  /****************************** */
  /*
    private minYear: number = 2017;
    private maxYear: number = new Date().getFullYear();
    private year: number = this.minYear;
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
    private yearData:any;
    private districtId:number=0;
  
    @Input()
    queryData: any;
  
    @Output()
    data: any;
    @Output()
    granularChange = new EventEmitter<any>()
  
    constructor(private http: HttpClient,private areaChartService:AreaChartPerDistService) { }
  
    ngOnInit() {
      console.log("granular: ")
      console.log("url");
      console.log(this.queryData.dataURL);
      this.districtId = this.queryData.districtId;
      let d = this.areaChartService.getDataReq();
      if(typeof d !='undefined'){
        this.year = d.year;
        this.granularChoosen = d.granular;
        this.districtId = d.districtId;
      }
      this.getData();
    }
  
    onClick() {
      console.log("emitted")
      this.granularChange.emit(this.data);
    }
  
    /* *********************************************************************************************************************
     * Setting the inputs from user 
     *
     * ********************************************************************************************************************
  
    onYearChange(event: any) {
      this.monthChoosen = event.value;
      console.log(event.value);
      this.year = event.value;
      this.updateData();
    }
  
    onGranularChange(event: any) {
      console.log("Granular changed" + event.value)
      this.granularChoosen = +event.value;
      this.updateData();
    }
  
    /* *********************************************************************************************************************
     * Get state data yeary, monthly and quarterly
     *
     *  
     * *********************************************************************************************************************
  
    getData() {
      let postData = {
        districtId : this.districtId
      }
      this.http.post<any>("http://localhost:3000/" + this.queryData.dataURL['Year'],postData)
        .subscribe(responseData => {
          console.log("year Data received");
          console.log(responseData);
          this.yearData = responseData;
      })
      this.http.post<any>("http://localhost:3000/" + this.queryData.dataURL['Month'],postData)
        .subscribe(responseData => {
          console.log("month Data received");
          console.log(responseData);
          this.monthlyData = responseData;
      })
      this.http.post<any>("http://localhost:3000/" + this.queryData.dataURL['Quarter'],postData)
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
  */
  /* *********************************************************************************************************************
  *  Update the data as per granualarity
  *
  *  
  * *********************************************************************************************************************/
  /*
    updateData() {
      console.log("Updating data")
      if (this.granularChoosen == 1) {
       
        this.data = this.yearData;
        console.log("Year data");
        console.log(this.data);
      }
      else if (this.granularChoosen == 2) {
        // Monthly 
        //console.log("Montly data for " + this.monthChoosen);
        const month  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug',"Sep",'Oct','Nov','Dec'];
        console.log("Month data");
        console.log(this.monthlyData);
        this.data = JSON.parse(JSON.stringify(this.getMonthData()));
        this.data.forEach( (d)=>{
          d['Month'] = month[d['Month']-1];
        })
        console.log(this.data);
      }
      else if (this.granularChoosen == 3) {
        // Quarterly 
        //console.log("Quarter data for " + this.quarterChoosen);
        console.log("Quarter data");
        console.log(this.quarterData);
        // to avoid copying reference 
        this.data = JSON.parse(JSON.stringify(this.getQuarterData()));
        this.data.forEach( (d)=>{
          d['Quarter'] = (d['Quarter']==1)?'Q1':(d['Quarter']==2)?'Q2':(d['Quarter']==3)?'Q3':'Q4';
        })
        console.log(this.data)
      }
      let sendingData = {
        data: this.data,
        year: this.year,
        granular: this.granularChoosen,
        parameterNumber : this.queryData.dataURL.parameterNumber,
        xColumnName : (this.granularChoosen==1)?"Year":(this.granularChoosen==2)?"Month":"Quarter"
      };
      this.areaChartService.updateChartData(sendingData);
    }
    */
}