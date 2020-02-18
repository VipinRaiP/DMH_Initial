import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LineChartPerDistService } from 'src/app/services/lineChartPerDist.service';
import { LineChartPerDistParameters } from 'src/app/model/linechartPerDistParameters.model';
import { AreaChartPerDistParameters } from 'src/app/model/areaChartPerDistParameters.model';
import { AreaChartPerDistService } from 'src/app/services/areaChartPerDist.service';
import { LineChartPerDistDataReq } from 'src/app/model/linechartPerDistParameters.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-per-dist-menu',
  templateUrl: './per-dist-menu.component.html',
  styleUrls: ['./per-dist-menu.component.css']
})
export class PerDistMenuComponent implements OnInit {

  private choosenDistrictId: number = 0;
  private distId = [];
  private districtData:any;

  constructor(private router: Router, private linechartPerDistService: LineChartPerDistService,
    private route: ActivatedRoute, private areaChartPerDistService: AreaChartPerDistService,
    private http:HttpClient) { }

  ngOnInit() {
    console.log("Per dist menu loaded");
    this.getDistrictData();

    let newDataReq: LineChartPerDistDataReq;
    newDataReq = {
      onSubmit: true,
      parameterNumber: 1,
      districtId: 1,
      year: 2017
    }
    this.linechartPerDistService.createDataReq(newDataReq);
  }

  onSubmit(form: NgForm) {
    console.log("Per dist form submitted")
    console.log(form)
    let newDataReq:LineChartPerDistDataReq = {
      onSubmit: true,
      districtId: (form.value.districtId=="")?1:+form.value.districtId,
      parameterNumber: (form.value.parameter == "") ? 1 : +form.value.parameter,
      year : 2017
    }
    this.linechartPerDistService.createDataReq(newDataReq);
  }

  getDistrictData(){
    this.http.get("http://localhost:3000/getDistrictData").subscribe((responseData)=>{
      console.log("Per dist Menu: District names recieved");
      console.log(responseData);
      this.districtData = responseData;
      this.districtData.forEach((d)=>{
        // Make district Id 1 as "" for displaying in options field as default
        d.DistrictId = (d.DistrictId==1)?"":d.DistrictId;
      })
    })
  }

}
