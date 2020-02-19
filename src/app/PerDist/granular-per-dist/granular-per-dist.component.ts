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
import { LineChartPerDistDataReq } from 'src/app/model/linechartPerDistParameters.model';
import { LineChartPerDistParameters } from 'src/app/model/linechartPerDistParameters.model';

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

  private year: number = 2018;
  public yearObj = new FormControl(moment());
  public data: any;
  private dataURL: any = "getAlcoholDataPerDist";
  private districtId: number = 1;
  private districtName: number;
  private timeFieldName: string = 'ReportingMonthyear';
  private parameterNumber:number = 1;
  public parameterName:string;
  public xColumnName = 'ReportingMonthyear';
  public tabularData:any;

  constructor(private http: HttpClient, private linechartPerDistService: LineChartPerDistService) {

  }

  ngOnInit(): void {

    let postData = {
      districtId: this.districtId
    }

    this.http.post<any>("http://localhost:3000/" + this.dataURL, postData)
      .subscribe(responseData => {
        console.log("Line chart : Data received from backend");
        console.log(responseData)
        this.data = responseData;
        this.districtName = this.data[0]['District'];
        let newDataReq = this.linechartPerDistService.getDataReq();
        this.processDataReq(newDataReq);
        this.linechartPerDistService.getDataReqListener().subscribe((newDataReq) => {
          console.log("Line chart granular : Data req received")
          this.processDataReq(newDataReq);
        })
      })
  }

  /* ***************************************************************************************************************************
   * On year change
   * 
   * ***************************************************************************************************************************/

  onYearChangeHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    console.log("Line chart granular : year called : " + normalizedYear.year())
    const ctrlValue = this.yearObj.value;
    ctrlValue.year(normalizedYear.year());
    this.yearObj.setValue(ctrlValue);
    datepicker.close();
    this.year = normalizedYear.year();
    this.updateData(this.year);
  }

  /* ***************************************************************************************************************************
   *  Process data request 
   * 
   * ***************************************************************************************************************************/

  processDataReq(newDataReq: LineChartPerDistDataReq) {
    let chartParameter: LineChartPerDistParameters = this.resolveChartParameters(newDataReq.districtId, newDataReq.parameterNumber);
    //update line chart parameter
    this.linechartPerDistService.updateParameters(chartParameter);
    if (!newDataReq.onSubmit)
      this.year = newDataReq.year;
    if ((newDataReq.districtId != this.districtId) || (this.parameterNumber!=newDataReq.parameterNumber)) {
      this.getData(newDataReq.districtId);
      this.districtId = newDataReq.districtId;
      this.parameterNumber = newDataReq.parameterNumber;
    }
    else
      this.updateData(this.year);

  }

  /* ***************************************************************************************************************************
   * Resolve chart parameters on parameter and district Id change
   * 
   * ***************************************************************************************************************************/

  resolveChartParameters(districtId, parameterNumber) {
    this.parameterName = this.resolveParameterName(parameterNumber);
    console.log("New parameter name : " + this.parameterName)
    if (parameterNumber == 1) {
      this.dataURL = "getAlcoholDataPerDist";
      return {
        yLabel: "Alcohol Cases",
        threshold: 30,
        yColumnName: this.parameterName
      }
    }
    if (parameterNumber == 2) {
      this.dataURL = "getSuicideDataPerDist"
      return {
        yLabel: "Suicide Cases",
        threshold: 6,
        yColumnName: this.parameterName
      }
    }
  }

  /* ***************************************************************************************************************************
   *  Get data for a district 
   * 
   * ***************************************************************************************************************************/

  getData(districtId) {
    let postData = {
      districtId: districtId
    }

    this.http.post<any>("http://localhost:3000/" + this.dataURL, postData)
      .subscribe(responseData => {
        console.log("Line chart : Data received from backend");
        console.log(responseData)
        this.data = responseData;
        this.districtName = this.data[0]['District'];
        this.updateData(this.year);
      })
  }

  /* ***************************************************************************************************************************
   *  Update chart data on year change
   * 
   * ***************************************************************************************************************************/

  updateData(year) {
    let newData = this.data.filter(d => {
      console.log(new Date(d[this.timeFieldName]).getFullYear())
      return (
        new Date(d[this.timeFieldName]).getFullYear() == year
      );
    });
    newData  = this.dataPreprocessing(newData);
    console.log("Line chart granular: filtered data");
    console.log(newData);
    /*let sendingData = {
      data: newData,
      districtId: this.districtId,
      districtName: this.districtName,
      year: year,
      xColumnName: this.timeFieldName
    }
    this.setTabularData();
    this.linechartPerDistService.updateChartData(sendingData);*/
    this.sendDataToChart(newData,year);
  }

  dataPreprocessing(filterData) {
    /*  Pre processing */
    this.data.forEach(d => {
      d[this.timeFieldName] = new Date(d[this.timeFieldName]).getTime();
    })
    return filterData;
  }

  /* ******************************************************************************************************************************
   *  Send data to chart
   * 
   * *****************************************************************************************************************************/

    sendDataToChart(newData,year){
      let sendingData = {
        data: newData,
        districtId: this.districtId,
        districtName: this.districtName,
        year: year,
        xColumnName: this.timeFieldName
      }
      this.setTabularData();
      this.linechartPerDistService.updateChartData(sendingData);
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

   /* ******************************************************************************************************************************
   *  Set Tabular Data
   * 
   * *****************************************************************************************************************************/

   setTabularData(){

      this.tabularData = JSON.parse(JSON.stringify(this.data));

      this.tabularData.forEach((d)=>{
          d[this.xColumnName] = new Date(d[this.xColumnName]).toDateString();
      })
   }



  /***************************************************************************************************************************** */
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