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
  private legend_1: any;
  private legend_2: any;


  constructor(private elementRef: ElementRef, private http: HttpClient, private barChartService: BarChartStateService, private titleService: Title,
    private linechartPerDistService: LineChartPerDistService, private router: Router, private allDistService: BarChartAllDistService) { }

  ngOnInit() {
    console.log("State barchart loaded");
    this.createChart();
    /* Chart parameter change service */
    this.barChartService.getParametersUpdateListener().subscribe((parameters) => {
      console.log("State chart: parameter update")
      console.log(parameters);
      this.chartParameters = parameters;
      localStorage.setItem('parameterNumber', this.chartParameters.parameterNumber + "");
    })

    /* Chart data change service */
    this.barChartService.getChartDataListener().subscribe( (newData) =>{
      this.data = newData.data;
      this.year = newData.year;
      this.granularChoosen = newData.granular;
      this.xColumnName = newData.xColumnName;
      localStorage.setItem('granularChoosen', this.granularChoosen + "");
      this.updateChart();
    });

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


    this.legend_1 = legendGroup
      .append("text")
      .attr("x", 220)
      .attr("y", 130)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");

    this.legend_2 = legendGroup
      .append("text")
      .attr("x", 220)
      .attr("y", 160)
      .style("font-size", "15px")
      .attr("alignment-baseline", "middle");
  }

  /* Update the chart with data */

  updateChart() {
    console.log("State chart : Data to chart")
    console.log(this.data);
    console.log("Granular choosen : " + this.granularChoosen);
    let xValue = this.xColumnName;
    let yValue = this.chartParameters.yColumnName;
    console.log("ycolumn = " + yValue)

    this.legend_1.text("Less than " + this.chartParameters.threshold);
    this.legend_2.text("More than " + this.chartParameters.threshold);

    // define X & Y domains
    let xDomain = this.data.map(d => d[xValue]);
    let yDomain = [0, d3.max(this.data, d => d[yValue])];

    // create scales
    this.xScale = d3.scaleBand().domain(xDomain).rangeRound([0, this.width - this.axisShortOffset]).padding(0.3);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height - this.axisShortOffset, 0]);

    // update scales & axis
    this.xScale.domain(this.data.map(d => d[xValue]));
    this.yScale.domain([0, d3.max(this.data, d => d[yValue])]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale))
      .selectAll("text")
      .attr("y", "3")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");;
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    // add labels
    this.yLabel.text(this.chartParameters.yLabel);
    this.xLabel.text(this.xColumnName);

    let rects = this.chart.selectAll('rect')
      .data(this.data);

    // remove exiting bars
    rects.exit().remove();

    // update existing bars
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
    let allDistService_copy = this.allDistService;
    rects
      .enter()
      .append('rect')
      .attr("class", "bar")
     /* .on("click", function (granularChoosen) {
        return function (actualData, mappedValue) {
          console.log("State chart : Bar clicked");
          granularChoosen = +localStorage.getItem('granularChoosen');
          console.log(actualData);
          console.log(parameterNumber);
          console.log(granularChoosen);
          console.log(year);

          let parameter: BarChartAllDistDataReq;

          parameter = {
            year: actualData.Year,
            granular: granularChoosen,
            choosenValue: (granularChoosen == 1) ? actualData.Year : (granularChoosen == 2) ? monthDict[actualData.Month] : quartDict[actualData.Quarter],
            parameterNumber: +localStorage.getItem('parameterNumber')
          }
          allDistService_copy.createDataReq(parameter);
        }
      }(this.granularChoosen))*/
      .on('click',drillDistView)
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

    /* Drill down to District chart */

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
      "Q3": 3,
      "Q4": 4
    }  
    function drillDistView(actualData, mappedValue) {
      console.log("State chart : Bar clicked");
      let granularChoosen = +localStorage.getItem('granularChoosen');
      let parameterNumber = +localStorage.getItem('parameterNumber');
      console.log(actualData);
      console.log(parameterNumber);
      console.log(granularChoosen);

      let parameter: BarChartAllDistDataReq;

      parameter = {
        year: actualData.Year,
        granular: granularChoosen,
        choosenValue: (granularChoosen == 1) ? actualData.Year : (granularChoosen == 2) ? monthDict[actualData.Month] : quartDict[actualData.Quarter],
        parameterNumber: parameterNumber,
        onSubmit:false
      }
      allDistService_copy.createDataReq(parameter);
    }

  }

  /* Year chaange event Handler */

/*  granularChangeHandler(event) {
    console.log("year change received");
    console.log(event);
    this.data = event.data;
    this.year = event.year;
    this.parameterNumber = event.parameterNumber;
    this.granularChoosen = event.granular;
    this.xColumnName = event.xColumnName;
    localStorage.setItem('granularChoosen', this.granularChoosen + "");
    this.updateChart();
  } */

}
