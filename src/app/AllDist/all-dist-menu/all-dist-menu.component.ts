import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LineChartPerDistService } from '../../services/lineChartPerDist.service';
import { LineChartPerDistParameters } from '../../model/linechartPerDistParameters.model';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BarChartAllDistParameters } from '../../model/barchartAllDistParameters.model';
import { BarChartAllDistService } from '../../services/barchartAllDist.service';
import { BarChartAllDistDataReq } from 'src/app/model/barchartAllDistDataReq.model';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-all-dist-menu',
  templateUrl: './all-dist-menu.component.html',
  styleUrls: ['./all-dist-menu.component.css']
})
export class AllDistMenuComponent implements OnInit, OnDestroy {

  mapView :boolean = false;


  @Input()
  private parameterNumber: number = 1;
  private params = Array(3);
  private parameterType;

  constructor(private barChartService: BarChartAllDistService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    console.log("All dist chart menu loaded")
    let newDataReq:BarChartAllDistDataReq = {
      onSubmit : true,
      granular :1,
      choosenValue: 2017,
      year: 2017,
      parameterNumber : 1
    }
    this.barChartService.createDataReq(newDataReq);  
  }
  mapToggle()
  {
    this.mapView = !this.mapView;
    console.log("MAP TOGGLE "+ this.mapView);
  }
  onSubmit(form: NgForm) {
    let parameters: BarChartAllDistParameters;
    this.parameterNumber = (form.value.parameter=="")?1:form.value.parameter;
    console.log("Choosen value : "+this.parameterType);
    let newDataReq:BarChartAllDistDataReq= {
      onSubmit : true,
      granular :1,
      choosenValue: 2017,
      year: 2017,
      parameterNumber : this.parameterNumber
    }
    this.barChartService.createDataReq(newDataReq);  
  }

  ngOnDestroy() {
  }

}

