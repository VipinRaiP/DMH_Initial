import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarChartStateService } from 'src/app/services/bar-chart-state.service';
import { Router } from '@angular/router';
import { LineChartPerDistService } from 'src/app/services/lineChartPerDist.service';
import { Title } from '@angular/platform-browser';
import * as d3 from 'd3';
import { BarChartStateParameters } from 'src/app/model/barChartStateParameters.model';
import { LineChartPerDistParameters } from 'src/app/model/linechartPerDistParameters.model';
import { BarChartAllDistService } from 'src/app/services/barchartAllDist.service';
import { BarChartAllDistDataReq } from 'src/app/model/barchartAllDistDataReq.model';

@Component({
  selector: 'app-bar-chart-state',
  templateUrl: './bar-chart-state.component.html',
  styleUrls: ['./bar-chart-state.component.css']
})
export class BarChartStateComponent implements OnInit {

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
  private chartParameters: BarChartStateParameters;
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

  private monthName = "Jan";
  private displayMonthData = false;
  private displayQuarterData = false;
  private granularChoosen: number; // Granualirity : 1: Annual , 2 : Month , 3: Quarter
  private dataURL: any;
  private xColumnName: string;

  private parameterNumber: number;


  constructor(private elementRef: ElementRef, private http: HttpClient, private barChartService: BarChartStateService, private titleService: Title,
    private linechartPerDistService: LineChartPerDistService, private router: Router, private allDistService: BarChartAllDistService) { }

  ngOnInit() {
    console.log("Getting barchart.............");
  
    this.chartParameters = this.barChartService.getParameters();
    this.createChart();
    this.dataURL = this.chartParameters.dataURL;
    console.log(this.dataURL);
    this.barChartService.getParametersUpdateListener().subscribe((parameters) => {
      this.chartParameters = parameters;
      this.dataURL = this.chartParameters.dataURL;
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
    let xValue = this.xColumnName;
    let yValue = this.chartParameters.yColumnName;
    console.log("ycolumn = " + yValue)
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
      .on("click", drillDistView)
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
    let columnName_copy = this.chartParameters.yColumnName;
    let linechartPerDistService_copy = this.linechartPerDistService;
    let router_copy = this.router;

    let parameterNumber = this.parameterNumber;
    let granularChoosen = this.granularChoosen;
    let year = this.year;
    let allDistService_copy = this.allDistService;

    let monthDict = {
      "Jan": 1,
      "Feb": 2,
      "Mar": 3,
      "Apr": 4,
      "May": 5,
      "Jun": 6,
      "Jul": 7,
      "Aug": 8,
      "Sep": 9,
      "Oct": 10,
      "Nov": 11,
      "Dec": 12
    };
    let quartDict = {
      "Q1": 1,
      "Q2": 2,
      "Q3": 3
    }

    /* Drill down to all district view */

    function drillDistView(actualData, mappedValue) {
      console.log("bar clicked");
      console.log(actualData);
      console.log(parameterNumber);
      console.log(granularChoosen);
      console.log(year);

      let parameter: BarChartAllDistDataReq;

      parameter = {
        year: actualData.Year,
        granular: granularChoosen,
        choosenValue: (granularChoosen == 1) ? actualData.Year : (granularChoosen == 2) ? monthDict[actualData.Month] : quartDict[actualData.Quarter]
      }
      allDistService_copy.createDataReq(parameter);
      router_copy.navigate(["distView", parameterNumber]);
    }
  }

  /* Year chaange event Handler */

  granularChangeHandler(event) {
    console.log("year change received");
    console.log(event);
    this.data = event.data;
    this.year = event.year;
    this.parameterNumber = event.parameterNumber;
    this.granularChoosen = event.granular;
    this.xColumnName = event.xColumnName;
    this.updateChart();
  }

}
