import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LineChartPerDistService } from 'src/app/services/lineChartPerDist.service';
import { LineChartPerDistParameters } from 'src/app/model/linechartPerDistParameters.model';

@Component({
  selector: 'app-per-dist-menu',
  templateUrl: './per-dist-menu.component.html',
  styleUrls: ['./per-dist-menu.component.css']
})
export class PerDistMenuComponent implements OnInit {

  private paramNumber: number = 0;

  constructor(private router: Router, private linechartPerDistService: LineChartPerDistService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    let linechartParameters: LineChartPerDistParameters;
    console.log(+form.value.districtId);
    linechartParameters = this.resolvePerDistParameter(+form.value.districtId, form.value.parameter);
    this.linechartPerDistService.updateParameters(linechartParameters);
    //this.router.navigate(["perDi"]);
  }

  /* Resolve parameters */

  resolvePerDistParameter(districtId, parameter) {
    this.paramNumber = districtId;
    if (parameter == "alcoholCases") {
      console.log("ParamNo : "+this.paramNumber)
      return {
        yLabel: "Alcohol Cases",
        data: "getAlcoholDataPerDist",
        threshold: 30,
        columnName: "AlcoholCases",
        districtId: districtId,
        district: null,
        year: 2018
      }
    }
    if (parameter == "suicideCases") {
      return {
        yLabel: "Suicide Cases",
        data: "getSuicideDataPerDist",
        threshold: 6,
        columnName: "SuicideCases",
        districtId: districtId,
        district: null,
        year: 2018
      }
    }
  }


}
