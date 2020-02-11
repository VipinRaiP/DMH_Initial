import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as d3 from 'd3';
import { BarChartAllDistService } from '../../services/barchartAllDist.service';
import { BarChartAllDistParameters } from '../../model/barchartAllDistParameters.model';
import { Title } from "@angular/platform-browser";
import * as $ from 'jquery';
import { Options } from 'ng5-slider';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { default as _rollupMoment, Moment } from 'moment';
import { ChildActivationStart, Routes, Router } from '@angular/router';
import { LineChartPerDistParameters } from '../../model/linechartPerDistParameters.model';
import { LineChartPerDistService } from '../../services/lineChartPerDist.service';
import { curveNatural } from 'd3';

//import moment = require('moment');

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
  selector: 'app-bar-chart-all-dist',
  templateUrl: './bar-chart-all-dist.component.html',
  styleUrls: ['./bar-chart-all-dist.component.css',
  ],
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

export class BarChartAllDistComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  private data: Array<any> = [];
  private margin: any = { top: 40, bottom: 20, left: 50, right: 20 };
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;
  private chartOffset: number = 30;
  private axisShortOffset: number = 100;
  private chartParameters: BarChartAllDistParameters;
  private yLabel: any;
  private xLabel: any;
  private parseTime = d3.timeParse("%d/%m/%Y");
  private formatTime = d3.timeFormat("%Y-%m-%d");
  private fromDate: string;
  private toDate: string;

  private year: number;
  private quarterData: any;
  private monthlyData: any;
  private annualData: any;
  private quarterChoosen: number = 1;
  private monthChoosen: number = 1;
  private months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  private monthName = "Jan";
  private displayMonthData = false;
  private displayQuarterData = false;
  private granularChoosen: number = 1; // Granualirity : 1: Annual , 2 : Month , 3: Quarter
  private dataURL: any;
  choosenValue: any;
  granular: number;

  constructor(private elementRef: ElementRef, private http: HttpClient, private barChartService: BarChartAllDistService, private titleService: Title,
    private linechartPerDistService: LineChartPerDistService, private router: Router) { }

  ngOnInit() {

    /*this.data = [
      { DistrictId: 41, AlcoholCases: 241 },
      { DistrictId: 16, AlcoholCases: 290 },
      { DistrictId: 25, AlcoholCases: 462 },
      { DistrictId: 38, AlcoholCases: 512 },
      { DistrictId: 33, AlcoholCases: 519 },
      { DistrictId: 1, AlcoholCases: 531 },
      { DistrictId: 20, AlcoholCases: 701 },
      { DistrictId: 30, AlcoholCases: 1183 },
      { DistrictId: 31, AlcoholCases: 1184 },
      { DistrictId: 27, AlcoholCases: 1200 },
      { DistrictId: 42, AlcoholCases: 1222 },
      { DistrictId: 17, AlcoholCases: 1402 },
      { DistrictId: 19, AlcoholCases: 1498 },
      { DistrictId: 44, AlcoholCases: 1566 },
      { DistrictId: 32, AlcoholCases: 1574 },
      { DistrictId: 39, AlcoholCases: 1575 },
      { DistrictId: 2,  AlcoholCases: 1603 },
      { DistrictId: 43, AlcoholCases: 1902 },
      { DistrictId: 3, AlcoholCases: 2204 },
      { DistrictId: 23, AlcoholCases: 2235 },
      { DistrictId: 35, AlcoholCases: 2783 },
      { DistrictId: 28, AlcoholCases: 3352 },
      { DistrictId: 29, AlcoholCases: 3424 },
      { DistrictId: 34, AlcoholCases: 3483 },
      { DistrictId: 12, AlcoholCases: 3689 },
      { DistrictId: 21, AlcoholCases: 4602 },
      { DistrictId: 13, AlcoholCases: 6858 },
      { DistrictId: 45, AlcoholCases: 10049 },
      { DistrictId: 15, AlcoholCases: 18280 },
      { DistrictId: 18, AlcoholCases: 20020 },
      { DistrictId: 37, AlcoholCases: 28236 }
    ];*/
    console.log("Getting barchart.............");
    /* this.barChartService.getParametersUpdateListener().subscribe( (barCharParams:BarChartAllDistParameters)=>{
         console.log(this.chartParameters);
         this.chartParameters = this.chartParameters;
     })*/
    this.chartParameters = this.barChartService.getParameters();
    console.log(this.chartParameters);
   /* if (this.chartParameters != null) {
      console.log("is not null");
      localStorage.setItem("chartParameters", JSON.stringify(this.chartParameters));
    }
    else {
      this.chartParameters = JSON.parse(localStorage.getItem("chartParameters"));
      console.log("Parsed" + this.chartParameters);
    }*/
    this.titleService.setTitle(this.chartParameters.yLabel);
    console.log(this.chartParameters);
    this.createChart();
    this.dataURL = this.chartParameters.dataURL;
    this.updateChart();

    this.barChartService.getChartDataListener().subscribe((d) => {
      console.log("Barchart Data changed");
      console.log(d);
      this.data = d.data;
      this.year = d.year;
      this.granular = d.granular;
      this.choosenValue = d.choosenValue;
      if (this.granular == 2)
        this.monthName = this.months[this.choosenValue-1];
      this.updateChart();
    })
  }

  /* Set up the chart */

  createChart() {
    let element = this.chartContainer.nativeElement;

    let svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    console.log(this.height);
    console.log(this.width);

    // chart plot area
    this.chart = svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // x & y axis
    this.xAxis = this.chart.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(${this.chartOffset}, ${this.height - this.axisShortOffset})`)

    this.yAxis = this.chart.append('g')
      .attr('class', 'axis axis-y')
      .attr('transform', `translate(${this.chartOffset},0)`)

    // X Label
    this.xLabel = this.chart.append("text")
      .attr("y", this.height - 20)
      .attr("x", this.width / 2 - 30)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("District");

    // Y Label
    this.yLabel = this.chart.append("text")
      .attr("y", -30)
      .attr("x", -(this.height / 2))
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")

    var legendGroup = svg.append("g")
      .attr("transform", "translate(" + (this.width - 400) + "," + (this.height - 110) + ")");

    legendGroup
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 130)
      .attr("r", 6)
      .style("fill", "green");

    legendGroup
      .append("circle")
      .attr("cx", 200)
      .attr("cy", 160)
      .attr("r", 6)
      .style("fill", "red");


    legendGroup
      .append("text")
      .attr("x", 220)
      .attr("y", 130)
      .text("Less than " + this.chartParameters.threshold)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

    legendGroup
      .append("text")
      .attr("x", 220)
      .attr("y", 160)
      .text("More than " + this.chartParameters.threshold)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  }

  /* Update the chart with data */

  updateChart() {
    console.log("Data to chart")
    console.log(this.data);
    let xValue = 'District';
    let yValue = this.chartParameters.columnName;

    //.......................

    // define X & Y domains
    let xDomain = this.data.map(d => d[xValue]);
    let yDomain = [0, d3.max(this.data, d => d[yValue])];

    console.log(yDomain)
    // create scales
    this.xScale = d3.scaleBand().domain(xDomain).rangeRound([0, this.width - this.axisShortOffset]).padding(0.3);

    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height - this.axisShortOffset, 0]);
    console.log(this.height)
    console.log(this.yScale(100));

    //...................................

    // update scales & axis
    this.xScale.domain(this.data.map(d => d[xValue]));
    this.yScale.domain([0, d3.max(this.data, d => d[yValue])]);
    //  this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale))
      .selectAll("text")
      .attr("y", "3")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");;
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    // add labels
    this.yLabel.text(this.chartParameters.yLabel);

    let rects = this.chart.selectAll('rect')
      .data(this.data);

    // remove exiting bars
    rects.exit().remove();

    // update existing bars
    //this.chart.selectAll('rects').transition()
    rects.transition()
      .attr('x', d => this.chartOffset + this.xScale(d[xValue]))
      .attr('y', d => this.yScale(d[yValue]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.axisShortOffset - this.yScale(d[yValue]))
      .style('fill', d => {
        if (d[yValue] > this.chartParameters.threshold)
          return 'red'
        else
          return 'green'
      })

    // add new bars
    rects
      .enter()
      .append('rect')
      .attr("class", "bar")
      .on("click", drillPerDist)
      .attr('x', d => this.chartOffset + this.xScale(d[xValue]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth)
      .attr('height', 0)
      .attr("cursor", "pointer")
      .style('fill', d => {
        if (d[yValue] > this.chartParameters.threshold)
          return 'red'
        else
          return 'green'
      })
      .transition()
      .attr('y', d => this.yScale(d[yValue]))
      .attr('height', d => this.height - this.axisShortOffset - this.yScale(d[yValue]))


    /* Bar chart on click naviagate to Per disrct line chart */

    let xScale_copy = this.xScale;
    let columnName_copy = this.chartParameters.columnName;
    let linechartPerDistService_copy = this.linechartPerDistService;
    let router_copy = this.router;
    function drillPerDist(actualData, mappedValue) {
      //d3.select(this).attr(‘opacity’, 1)
      console.log("bar clicked");

      let linechartParameters: LineChartPerDistParameters;
      linechartParameters = resolvePerDistParameter(actualData.DistrictId, columnName_copy, actualData.District);
      console.log(linechartParameters);
      linechartPerDistService_copy.updateParameters(linechartParameters);
      router_copy.navigate(["perDist"]);
      //window.open("/lineChartPerDist")
      //router_copy.navigate([]).then(result => {  window.open("lineChartPerDist?year="+this.year, '_blank'); });
    }

    /* Resolve parameters */
    let year_copy = this.year;
    function resolvePerDistParameter(districtId, parameter, district) {
      if (parameter == "AlcoholCases") {
        return {
          yLabel: "Alcohol Cases",
          data: "getAlcoholDataPerDist",
          threshold: 30,
          columnName: "AlcoholCases",
          districtId: districtId,
          district: district,
          year: year_copy
        }
      }
      if (parameter == "SuicideCases") {
        return {
          yLabel: "Suicide Cases",
          data: "getSuicideDataPerDist",
          threshold: 6,
          columnName: "SuicideCases",
          districtId: districtId,
          district: district,
          year: year_copy
        }
      }
    }
  }

  /*getData(postData) {
    this.http.post<any>("http://localhost:3000/" + this.chartParameters.data, postData)
      .subscribe(responseData => {
        console.log("Data received");
        console.log(responseData);
        this.data = responseData;
        this.updateChart();
      })
  }*/

  /* Year chaange event Handler */

  onYearChangeHandler(event) {
    console.log("year change received");
    console.log(event);
    this.data = event.data;
    this.year = event.year;
    this.updateChart();
  }

}