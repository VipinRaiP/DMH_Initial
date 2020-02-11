import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LineChartPerDistService } from '../../services/lineChartPerDist.service';
import { LineChartPerDistParameters } from '../../model/linechartPerDistParameters.model';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BarChartAllDistParameters } from '../../model/barchartAllDistParameters.model';
import { BarChartAllDistService } from '../../services/barchartAllDist.service';

@Component({
  selector: 'app-all-dist-menu',
  templateUrl: './all-dist-menu.component.html',
  styleUrls: ['./all-dist-menu.component.css']
})
export class AllDistMenuComponent implements OnInit, OnDestroy {
  @Input()
  private paramNumber: number = 0;
  private params = Array(3);
  private parameterType;

  constructor(private barchartService: BarChartAllDistService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {

    //if(localStorage.getItem('paramNumber')!=null)
    //  this.paramNumber = +localStorage.getItem('paramNumber');

    //this.barchartService.updateParameters(this.resolveParameter(this.paramNumber));
    this.route.params.subscribe((params => {
      console.log("Parameter Number received: "+params['paramNumber']);
      this.paramNumber = params['paramNumber'];
      this.barchartService.updateParameters(this.resolveParameter(this.paramNumber));
    }))
  }

  onSubmit(form: NgForm) {
    let parameters: BarChartAllDistParameters;
    this.parameterType = form.value.parameter;
    console.log(this.parameterType);
    this.paramNumber = form.value.parameter;
    parameters = this.resolveParameter(this.paramNumber);
    this.barchartService.updateParameters(parameters);
  }

  /* Resolve parameters */

  resolveParameter(parameterNumber) {
    if (parameterNumber == 1) {
      console.log("parameter updating alcohol")
      return {
        yLabel: "Alcohol Cases",
        data: "getAlcoholDataAllDist",
        threshold: 3000,
        columnName: "AlcoholCases",
        dataURL: {
          Annual: "getAlcoholDataAllDistAnnually",
          Quarter: "getAlcoholDataAllDistQuart",
          Monthly: "getAlcoholDataAllDistMonthly"
        }
      }
    }
    else if (parameterNumber == 2) {
      console.log("getting urls")
      return {
        yLabel: "Suicide Cases",
        data: "getSuicideDataAllDist",
        threshold: 3000,
        columnName: "SuicideCases",
        dataURL: {
          Annual: "getSuicideDataAllDistAnnually",
          Quarter: "getSuicideDataAllDistQuart",
          Monthly: "getSuicideDataAllDistMonthly"
        }
      }
    }
  }

  ngOnDestroy() {
    //localStorage.setItem("paramNumber", this.paramNumber + '');
  }

}

