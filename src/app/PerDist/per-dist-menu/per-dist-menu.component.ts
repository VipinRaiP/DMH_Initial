import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LineChartPerDistService } from 'src/app/services/lineChartPerDist.service';
import { LineChartPerDistParameters } from 'src/app/model/linechartPerDistParameters.model';

@Component({
  selector: 'app-per-dist-menu',
  templateUrl: './per-dist-menu.component.html',
  styleUrls: ['./per-dist-menu.component.css']
})
export class PerDistMenuComponent implements OnInit {

  private choosenDistrictId: number = 0;
  private distId =[];

    
  constructor(private router: Router, private linechartPerDistService: LineChartPerDistService,
    private route:ActivatedRoute) { }

  ngOnInit() {
    for(var i=1;i<50;i++){
      this.distId.push(i);
    }
    console.log(this.distId);
    this.route.params.subscribe((params => {
      console.log("Parameter Number received: "+params['distId']);
      this.choosenDistrictId = params['distId'];
      //this.linechartPerDistService.updateParameters(this.resolvePerDistParameter(this.paramNumber));
    }))
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
    this.choosenDistrictId = districtId;
    if (parameter == "alcoholCases") {
      console.log("ParamNo : "+this.choosenDistrictId)
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
