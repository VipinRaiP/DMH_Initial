import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-stack-line-chart',
  templateUrl: './stack-line-chart.component.html',
  styleUrls: ['./stack-line-chart.component.css']
})
export class StackLineChartComponent implements OnInit {

  public svg: any;
  public data: any;
  private parseTime = d3.timeParse("%Y-%m-%d");
  private formatTime = d3.timeFormat("%Y-%m-%d");
  public margin: any;
  public width: any;
  public height: any;
  public strokeWidth: any;
  public group: any;
  public chart: any;
  public color: any;
  public legend: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.createChart();
    this.getData();

  }

  createChart() {
    // set the dimensions and margins of the graph
    this.margin = { top: 30, right: 0, bottom: 20, left: 100 },


      // append the svg object to the body of the page
      this.svg = d3.select("#chart-area")
        .append("svg")
        .attr("width", 1398)
        .attr("height", 400)
        .attr("transform",
          "translate(" + (0) + "," + 5 + ")");

    this.strokeWidth = 1.5;
    this.width = this.svg.attr("width") - this.margin.left - this.margin.right - this.strokeWidth * 2;
    this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom - 50;


    this.chart = this.svg.append("g")
      .attr("transform",
        "translate(" + (this.margin.left) + "," + 0 + ")");

    this.group = this.chart.append("g")
      .attr("transform", `translate(-${this.margin.left - this.strokeWidth},-${this.margin.top})`);

    //this.color = ["lightgreen", "lightblue"];

    this.color = ["#1b9e77", "#d95f02"]

    // Legend

    this.legend = this.svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (1000) + "," + 350 + ")")
      .attr("x", 165)
      .attr("y", 25)
      .attr("height", 100)
      .attr("width", 100);


  }


  updateChart() {
    const stack = d3.stack().keys(["Male", "Female"]);
    console.log(this.data);
    const stackedValues = stack(this.data);
    console.log(stackedValues);

    const stackedData = [];

    // Copy the stack offsets back into the data.
    stackedValues.forEach((layer, index) => {
      const currentStack = [];
      layer.forEach((d, i) => {
        currentStack.push({
          values: d,
          time: this.data[i].ReportingMonthYear
        });
      });
      stackedData.push(currentStack);

    });

    console.log(stackedData);

    // create scales

    // Create scales
    const yScale = d3
      .scaleLinear()
      .range([this.height, 0])
      .domain([0, d3.max(stackedValues[stackedValues.length - 1], dp => dp[1])]);
    const xScale = d3.scaleLinear()
      .range([0, this.width])
      .domain(d3.extent(this.data, d => +d['ReportingMonthYear']))


    const area = d3
      .area()
      .x(dataPoint => xScale(dataPoint['time']))
      .y0(dataPoint => yScale(dataPoint.values[0]))
      .y1(dataPoint => yScale(dataPoint.values[1]));


    const series = this.svg
      .selectAll(".series")
      .data(stackedData)
      .enter()
      .append("g")
      .attr("class", "series1");

    series
      .append("path")
      .attr("transform", `translate(${this.margin.left},5)`)
      .style("fill", (d, i) => this.color[i])
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", this.strokeWidth)
      .attr("d", d => area(d))


    /* series1.selectAll("circle")
      .data(stackedData[0])
      .enter()
      .append("circle")
      .attr("transform", `translate(${this.margin.left},5)`)
      //.attr("class","data-circle")
      .attr("r", 5)
      .attr("cx", dataPoint => xScale(dataPoint['time']))
      //.y0(dataPoint => yScale(dataPoint.values[0]))
      .attr("cy", dataPoint => yScale(dataPoint.values[1])); */

    /*  series2.selectAll("circle")
        .data(stackedData[1])
        .enter()
        .append("circle")
        .attr("transform", `translate(${this.margin.left},5)`)
        //.attr("class","data-circle")
        .attr("r", 5)
        .attr("cx", dataPoint => xScale(dataPoint['time']))
        //.y0(dataPoint => yScale(dataPoint.values[0]))
        .attr("cy", dataPoint => yScale(dataPoint.values[1]));*/



    // Add the X Axis
    this.chart
      .append("g")
      .attr('class', 'x axis')
      .attr("transform", `translate(0,${this.height + 5})`)
      .call(d3.axisBottom(xScale).ticks(this.data.length).tickFormat(d3.timeFormat("%b-%Y")))


    // Add the Y Axis
    this.chart
      .append("g")
      .attr('class', 'axis axis-y')
      .attr("transform", `translate(0, 5)`)
      .call(d3.axisLeft(yScale));

    // Add legends

    console.log("Stacked Data");
    console.log(stackedData);

    this.legend.selectAll('rect')
      .data(stackedData)
      .enter()
      .append("rect")
      .attr("x", 100)
      .attr("y", (d, i) => i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", (d, i) => this.color[i]);

    const labels = ["Male", "Female"];

    this.legend.selectAll('text')
      .data(stackedData)
      .enter()
      .append("text")
      .attr("x", 130)
      .attr("y", (d, i) => 10 + i * 20)
      .text(function (d, i) { return labels[i] })

  }

  getData() {
    this.http.get("http://localhost:3000/getStateAlcoholCasesGenderTime")
      .subscribe((responseData) => {
        console.log(responseData);
        this.data = responseData;
        this.data.forEach(d => {
          d['ReportingMonthYear'] = new Date(d['ReportingMonthYear']).getTime();
        });
        this.updateChart();
      })

  }


}
