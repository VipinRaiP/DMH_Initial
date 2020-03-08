import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { default as _rollupMoment, Moment } from 'moment';
import { HttpClient } from '@angular/common/http';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MapService } from '../main-map/main-map.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



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
  public year: number = new Date().getFullYear();
  public quarterData: any;
  public monthlyData: any;
  public annualData: any;
  public districtSelected: String = "NIL";
  public janData: string;
  public febData: string;
  public marData: string;
  public aprData: string;
  public mayData: string;
  public juneData: string;
  public julyData: string;
  public augData: string;
  public septData: string;
  public octData: string;
  public novData: string;
  public decData: string;

  public quat1Data: string;
  public quat2Data: string;
  public quat3Data: string;
  public quat4Data: string;

  public yearData: string;
  public parameterNumber: number;
  private dataURL: {
    Year: string,
    Month: string,
    Quarter: string
  }
  private yColumnName: string;

  public dialogData:any = {};


  constructor(private http: HttpClient, private mapService: MapService,public dialog: MatDialog) {
  }

  ngOnInit() {
    console.log("Map details compoent loaded")
    this.initializeMonthlyData();
    this.initializeQuarterlyData();
    this.initializeYearlyData();
    this.mapService.onDistrictSelected.subscribe(
      (emitData) => {
        this.initializeMonthlyData();
        this.initializeQuarterlyData();
        this.initializeYearlyData();
        console.log("Map details: Data Received")
        this.districtSelected = emitData.district;
        this.dialogData.districtSelected = this.districtSelected;
        this.parameterNumber = emitData.parameterNumber;
        this.year = emitData.year;
        this.yColumnName = emitData.yColumnName;
        console.log(this.districtSelected);
        this.resolveURL(this.parameterNumber);
        this.getYearData(this.year, this.districtSelected);
        //this.updateData(this.monthlyData);
      }
    )
  }

  public yearObj = new FormControl(moment());

  /*choosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.yearObj.value;
    ctrlValue.year(normalizedYear.year());
    this.yearObj.setValue(ctrlValue);
    datepicker.close();
     this.year = normalizedYear.year();
     this.mapService.onYearChanged.emit(this.year);
    this.getYearData(this.year,this.districtSelected);
    //this.updateData(this.monthlyData);
  }*/

  getYearData(year: number, district: String) {
    console.log(year)
    let postData = {
      year: year,
      district: district
    }


    this.http.post<any>(this.dataURL['Month'], postData)
      .subscribe(responseData => {
        console.log("Map Details : Month Data received");
        console.log(responseData);
        this.initializeMonthlyData();
        this.updateMonthlyData(responseData);
        this.monthlyData = responseData;
        //this.updateData();
      })

    this.http.post<any>(this.dataURL['Quarter'], postData)
      .subscribe(responseData => {
        console.log("Map Details : Quarter Data received");
        console.log(responseData);
        this.initializeQuarterlyData();
        this.updateQuarterData(responseData);
        //this.monthlyData = responseData;
        //this.updateData();
      })

    this.http.post<any>(this.dataURL['Year'], postData)
      .subscribe(responseData => {
        console.log("Map Details : Year Data received");
        console.log(responseData);
        this.initializeYearlyData();
        this.updateYearData(responseData);
        this.openDialog();
        //this.monthlyData = responseData;
        //this.updateData();
      })
  }

  updateMonthlyData(monthlyData) {
    console.log("Executed");
    if (monthlyData != null) {
      for (var data of monthlyData) {

        if (data.month == 1) {
          this.dialogData.janData = data[this.yColumnName];
        }
        else if (data.month == 2) {
          this.dialogData.febData = data[this.yColumnName];
        }
        else if (data.month == 3) {
          this.dialogData.marData = data[this.yColumnName];
        }
        else if (data.month == 4) {
          this.dialogData.aprData = data[this.yColumnName];
        }
        else if (data.month == 5) {
          this.dialogData.mayData = data[this.yColumnName];
        }
        else if (data.month == 6) {
          this.dialogData.juneData = data[this.yColumnName];
        }
        else if (data.month == 7) {
          this.dialogData.julyData = data[this.yColumnName];
        }
        else if (data.month == 8) {
          this.dialogData.augData = data[this.yColumnName];
        }
        else if (data.month == 9) {
          this.dialogData.septData = data[this.yColumnName];
        }
        else if (data.month == 10) {
          this.dialogData.octData = data[this.yColumnName];
        }
        else if (data.month == 11) {
          this.dialogData.novData = data[this.yColumnName];
        }
        else if (data.month == 12) {
          this.dialogData.decData = data[this.yColumnName];
        }


      }
    }
  }

  updateQuarterData(quarterlyData) {

    if (quarterlyData != null) {
      for (var qdata of quarterlyData) {
        if (qdata.Quarter == 1) {
          this.dialogData.quat1Data = qdata[this.yColumnName];
        }
        else if (qdata.Quarter == 2) {
          this.dialogData.quat2Data = qdata[this.yColumnName];
        }
        else if (qdata.Quarter == 3) {
          this.dialogData.quat3Data = qdata[this.yColumnName];
        }
        else if (qdata.Quarter == 4) {
          this.dialogData.quat4Data = qdata[this.yColumnName];
        }
      }
    }

  }

  updateYearData(yearlyData) {
    console.log("YEAR DATA " + yearlyData);
    if (yearlyData != null) {
      for (var ydata of yearlyData) {
        this.dialogData.yearData = ydata[this.yColumnName];
      }
    }
  }

  initializeMonthlyData() {
    this.dialogData.janData = "No Data Available";
    this.dialogData.febData = "No Data Available";
    this.dialogData.marData = "No Data Available";
    this.dialogData.aprData = "No Data Available";
    this.dialogData.mayData = "No Data Available";
    this.dialogData.juneData = "No Data Available";
    this.dialogData.julyData = "No Data Available";
    this.dialogData.augData = "No Data Available";
    this.dialogData.septData = "No Data Available";
    this.dialogData.octData = "No Data Available";
    this.dialogData.novData = "No Data Available";
    this.dialogData.decData = "No Data Available";
  }

  initializeQuarterlyData() {
    this.dialogData.quat1Data = "No Data Available";
    this.dialogData.quat2Data = "No Data Available";
    this.dialogData.quat3Data = "No Data Available";
    this.dialogData.quat4Data = "No Data Available";
  }

  initializeYearlyData() {
    this.dialogData.yearData = "No Data Available";
  }

  /* ******************************************************************************************************************************
   *  Resolve data url based on parameter choosen
   *
   * ******************************************************************************************************************************/

  resolveURL(parameterNumber) {

    switch (+parameterNumber) {
      case 1:
        this.dataURL = {
          Year: "http://localhost:3000/getAlcoholDataYearlyPerDistrictByName",
          Quarter: "http://localhost:3000/getAlcoholDataQuarterlyPerDistrictByName",
          Month: "http://localhost:3000/getAlcoholDataMonthlyPerDistrictByName"
        }
        break;
      case 2:
        this.dataURL = {
          Year: "http://localhost:3000/getSuicideDataYearlyPerDistrictByName",
          Month: "http://localhost:3000/getSuicideDataMonthlyPerDistrictByName",
          Quarter: "http://localhost:3000/getSuicideDataQuarterlyPerDistrictByName"
        }
        break;
    }
  }



  /* Open the dialog */

  openDialog() {
    const dialogRef = this.dialog.open(PerDistDataDialog, {
      width: '1000px',
      data: this.dialogData
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Map Main: The dialog was closed');
    });
  }


}



/* ******************************************************************************************************************************* 
 *   Dialog component  
 *
 * *******************************************************************************************************************************/

@Component({
  selector: 'map-per-dist-dialog',
  templateUrl: 'per-dist-data-dialog.html',
})
export class PerDistDataDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data) { }
}


