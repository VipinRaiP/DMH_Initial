import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {Router } from '@angular/router';
import {BarChartAllDistParameters} from "../model/barchartAllDistParameters.model";
import { BarChartAllDistService } from '../services/barchartAllDist.service';
import {FormBuilder, NgForm} from '@angular/forms';
import { LineChartPerDistService } from '../services/lineChartPerDist.service';
import { LineChartPerDistParameters } from '../model/linechartPerDistParameters.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent implements OnInit {

  ngOnInit() {
  }

  constructor(private router:Router,private barchartService:BarChartAllDistService,
              private linechartPerDistService:LineChartPerDistService){

  }
  
}
