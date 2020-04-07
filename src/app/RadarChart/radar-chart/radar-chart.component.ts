import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.css']
})
export class RadarChartComponent implements OnInit {

  public data:any;
  public RadarChartData = [];
  public RadarChartLabels;
  public DisplayRadarChart = false;

  constructor(private http:HttpClient) { }

  ngOnInit() {
    console.log("Radar chart loaded")
    this.getData();
  }

  public demoradarChartLabels:string[] = ['Designer', 'Developer', 'Tester', 'Clients', 'HR'];
 
  public demoradarChartData:any = [
    {data: [20, 40, 15, 30, 12], label: 'Company A'},
    {data: [30, 40, 20, 35, 15], label: 'Company B'}
  ];
  public radarChartType:string = 'radar';
 
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  public getData(){
    this.http.get('http://localhost:3000/getDistrictDataForRadarChart').subscribe((response)=>  {
        console.log('Radar chart : Data received');
        console.log(response);
        this.data = response;
        this.formatData();
    })
  }

  public formatData(){
    let districtId1 = 1; 
    let districtId2 = 2;
    let districtId3 = 3;
    let districtId4 = 21;

    this.RadarChartLabels = Object.keys(this.data[0]).slice(2,);
    let values = Object.values(this.data[0]).slice(2,);  

    console.log("Radar chart : Data labels");
    console.log(this.RadarChartLabels);

    console.log("Radar chart : Data values");
    console.log(values);

    this.data.forEach(d => {
      if(d.DistrictId == districtId1 || d.DistrictId==districtId2 || d.DistrictId==districtId3 || d.DistrictId==districtId4){
        this.RadarChartData.push({
          data :Object.values(d).slice(2,),
          label : d.District
        })
      } 
    })
    this.DisplayRadarChart = true;
    console.log(this.RadarChartData);
  }
  
  

  
}
