import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LineChartPerDistService } from 'src/app/services/lineChartPerDist.service';
import { LineChartPerDistParameters } from 'src/app/model/linechartPerDistParameters.model';
import { AreaChartPerDistParameters } from 'src/app/model/areaChartPerDistParameters.model';
import { AreaChartPerDistService } from 'src/app/services/areaChartPerDist.service';
import { LineChartPerDistDataReq } from 'src/app/model/linechartPerDistParameters.model';

@Component({
  selector: 'app-per-dist-menu',
  templateUrl: './per-dist-menu.component.html',
  styleUrls: ['./per-dist-menu.component.css']
})
export class PerDistMenuComponent implements OnInit {

  private choosenDistrictId: number = 0;
  private distId = [];
  private distNames = [{
    name :"dk",
    id : 1},{name:"uk",id:2},{name:"Mysore",id:3}];

  constructor(private router: Router, private linechartPerDistService: LineChartPerDistService,
    private route: ActivatedRoute, private areaChartPerDistService: AreaChartPerDistService) { }

  ngOnInit() {
    console.log("Per dist menu loaded")
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

}
