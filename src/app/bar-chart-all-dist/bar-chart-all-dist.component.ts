import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import * as d3 from 'd3';
import { BarChartAllDistService } from '../services/barchartAllDist.service';
import { BarChartAllDistParameters } from '../model/barchartAllDistParameters.model';
import { Title } from "@angular/platform-browser";
import * as $ from 'jquery';
import { Options } from 'ng5-slider';
import { MatDatepickerInputEvent, MatDatepicker } from '@angular/material';
import * as _moment from 'moment';
import { FormControl } from '@angular/forms';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { default as _rollupMoment, Moment } from 'moment';
import { ChildActivationStart } from '@angular/router';


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
    '../../../node_modules/jquery-ui-dist/jquery-ui.min.css',
    '../../../node_modules/jquery-ui-dist/jquery-ui.structure.min.css',
    '../../../node_modules/jquery-ui-dist/jquery-ui.theme.min.css'],
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
  private data: Array<any>;
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

  private year: number = new Date().getFullYear();
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

  constructor(private elementRef: ElementRef, private http: HttpClient, private barChartService: BarChartAllDistService, private titleService: Title) { }

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
    this.chartParameters = this.barChartService.getParameters();
    console.log(this.chartParameters);
    if (this.chartParameters != null) {
      console.log("is not null");
      localStorage.setItem("chartParameters", JSON.stringify(this.chartParameters));
    }
    else {
      this.chartParameters = JSON.parse(localStorage.getItem("chartParameters"));
      console.log("Parsed" + this.chartParameters);
    }
    this.titleService.setTitle(this.chartParameters.yLabel);
    console.log(this.chartParameters);
    this.createChart();
    this.fromDate = "2017-12-01";
    this.toDate = this.formatTime(new Date());
    let postData = {
      fromDate: this.fromDate,
      toDate: this.toDate
    }
    //this.getData(postData);
    //console.log(document.getElementById("slider"));
    this.getYearData(this.year);
    this.updateData();
    this.createChart();
    this.updateChart();
  }

  addFromDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log("From Date added");
    console.log(type);
    console.log(event.value);
    console.log(this.formatTime(event.value))
    this.fromDate = this.formatTime(event.value);
  }

  addToDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log("To Date added");
    console.log(type);
    console.log(event.value);
    console.log(this.formatTime(event.value))
    this.toDate = this.formatTime(event.value);
  }


  onClickGetChart() {
    let postData = {
      fromDate: this.fromDate,
      toDate: this.toDate
    }
    console.log("clicked")
    console.log(postData);
    this.getData(postData);
    this.updateChart();
  }

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

    // Add jQuery UI slider

    /*($("#date-slider")as any).slider({
      range: true,
      //max: parseTime("31/10/2017").getTime(),
      max: new Date().getTime(),
      min: this.parseTime("12/8/2017").getTime(),
      step: 86400000, // One day
      values: [this.parseTime("12/8/2017").getTime(), new Date().getTime()],
      slide: function (event, ui) {
        $("#dateLabel1").text(this.formatTime(new Date(ui.values[0])));
        $("#dateLabel2").text(this.formatTime(new Date(ui.values[1])));
      }
    });*/

  }

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
      .attr('x', d => this.chartOffset + this.xScale(d[xValue]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth)
      .attr('height', 0)
      .style('fill', d => {
        if (d[yValue] > this.chartParameters.threshold)
          return 'red'
        else
          return 'green'
      })
      .transition()
      .attr('y', d => this.yScale(d[yValue]))
      .attr('height', d => this.height - this.axisShortOffset - this.yScale(d[yValue]))
  }

  getData(postData) {
    this.http.post<any>("http://localhost:3000/" + this.chartParameters.data, postData)
      .subscribe(responseData => {
        console.log("Data received");
        console.log(responseData);
        this.data = responseData;
        this.updateChart();
      })
  }

  /* *********************************************************************************************************************
   * Setting the inputs from user 
   *
   * ********************************************************************************************************************/

  onMonthChange(event: any) {
    this.monthChoosen = event.value;
    this.monthName = this.months[this.monthChoosen - 1];
    console.log("Month changed");
    console.log(event.value);
    this.updateData();
  }

  onQuarterChange(event: any) {
    console.log("Quarter changed " + event.value);
    this.quarterChoosen = event.value;
    this.updateData();
  }

  onGranularChange(event: any) {
    console.log("Granular changed" + event.value)
    this.granularChoosen = +event.value;
    switch(this.granularChoosen){
      case 2:
          console.log("choosed")
          this.displayMonthData = true;
          this.displayQuarterData = false;
          break;
      case 3:
        this.displayMonthData = false;
        this.displayQuarterData = true;
        break;
      case 1:
        this.displayMonthData = false;
        this.displayQuarterData = false;  
    }
    this.updateData();
  }

  /* *********************************************************************************************************************
   * Get the monthly quarterly and annual data for a year selected  
   *
   *  
   * *********************************************************************************************************************/


  getYearData(year: number) {
    console.log(year)
    let postData = {
      year: year
    }
    this.http.post<any>("http://localhost:3000/" + "getAlcoholDataAllDistAnnually", postData)
      .subscribe(responseData => {
        console.log("Data received");
        console.log(responseData);
        this.annualData = responseData;
      })

    this.http.post<any>("http://localhost:3000/" + "getAlcoholDataAllDistQuart", postData)
      .subscribe(responseData => {
        console.log("Data received");
        console.log(responseData);
        this.quarterData = responseData;
      })

    this.http.post<any>("http://localhost:3000/" + "getAlcoholDataAllDistMonthly", postData)
      .subscribe(responseData => {
        console.log("Data received");
        console.log(responseData);
        this.monthlyData = responseData;
        this.updateData();
      })
  }

  private yearObj = new FormControl(moment());

  choosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    console.log("year called : " + normalizedYear.year())
    //this.radioPresent=!this.radioPresent;
    const ctrlValue = this.yearObj.value;
    ctrlValue.year(normalizedYear.year());
    this.yearObj.setValue(ctrlValue);
    datepicker.close();
    this.year = normalizedYear.year();
    this.annualData = [];
    this.monthlyData = [];
    this.quarterData = [];
    this.getYearData(this.year);
  }

  getMonthData() {
    console.log(this.monthlyData)
    //this.monthChoosen = 6;
    let monthDataTemp =  this.monthlyData[this.monthChoosen];
    return (this.monthlyData[this.monthChoosen]==null)?[]:this.monthlyData[this.monthChoosen] ;
  }

  getQuarterData() {
    return (this.quarterData[this.quarterChoosen]==null)?[]:this.quarterData[this.quarterChoosen];
  }

  /* *********************************************************************************************************************
  *  Update the data as per granualarity
  *
  *  
  * *********************************************************************************************************************/

  updateData() {

    if (this.granularChoosen == 1) {
      /* Annual */
      this.data = this.annualData;
      console.log("Annual data");
      console.log(this.data);
      this.updateChart();
    }
    else if (this.granularChoosen == 2) {
      /* Monthly */
      console.log("Montly data for " + this.monthChoosen);
      console.log(this.monthlyData);
      this.data = this.getMonthData();
      console.log(this.data);
      this.updateChart();
    }
    else if (this.granularChoosen == 3) {
      /* Quarterly */
      console.log("Quarter data for " + this.quarterChoosen);
      console.log(this.quarterData);
      this.data = this.getQuarterData();
      console.log(this.data)
      this.updateChart();  
    }
  }


}