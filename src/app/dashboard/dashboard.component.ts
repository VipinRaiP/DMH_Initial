import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public donutChartData = [];

  public AlcoholGenderWiseData;
  public DistrictData  = {
    water : 20,
    land  : 30,
    sand  : 50,
    grass : 100,
    earth : 130
  }
  public pieChartId = ["pie-chart-1","pie-chart-2"];
  public pieChartLoad = false;
  constructor(private http:HttpClient) { }

  ngOnInit() {
    this.getData();
  }

  public getData(){
    this.http.get("http://localhost:3000/getStateAlcoholDataGenderWise")
        .subscribe((responseData)=>{
            console.log(responseData);
            this.AlcoholGenderWiseData = responseData[0]; 
            this.pieChartLoad = true;
        })
  }


}
