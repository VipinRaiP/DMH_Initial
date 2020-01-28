import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { LineChartPerDistParameters } from '../model/linechartPerDistParameters.model';
import { LineChartPerDistService } from '../services/lineChartPerDist.service';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-line-chart-per-dist',
  templateUrl: './line-chart-per-dist.component.html',
  styleUrls: ['./line-chart-per-dist.component.css']
})
export class LineChartPerDistComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  public data: Array<any>;
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
  private chartParameters: LineChartPerDistParameters;
  private yLabel: any;
  private xLabel: any;
  private parseTime = d3.timeParse("%Y-%m-%d");
  private formatTime = d3.timeFormat("%Y-%m-%d");
  private fromDate: any;
  private toDate: any;
  private xColumnName: string = "ReportingMonthyear";
  private path: any;
  private line: d3.Line<[number, number]>; // this is line defination
  


  constructor(private http: HttpClient, private lineChartService: LineChartPerDistService, private titleService: Title) { }

  ngOnInit() {
    console.log("Getting linechart.............");
    this.chartParameters = this.lineChartService.getParameters();
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
    this.fromDate = new Date(2017, 12, 12).getTime();
    this.toDate = new Date().getTime();
    let postData = {
      districtId: this.chartParameters.districtId,
      fromDate: this.fromDate,
      toDate: this.toDate
    }
    this.getData(postData);
  }

  addFromDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log("From Date added");
    console.log(type);
    console.log(new Date(event.value).getTime());
    console.log(this.formatTime(event.value))
    this.fromDate = new Date(event.value).getTime();
  }

  addToDate(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log("To Date added");
    console.log(type);
    console.log(event.value);
    console.log(this.formatTime(event.value))
    this.toDate = new Date(event.value).getTime();
  }


  onClickGetChart() {
    let postData = {
      districtId: this.chartParameters.districtId,
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
      .attr("y", this.height - 30)
      .attr("x", this.width / 2 - 30)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Month-Year");

    // Y Label
    this.yLabel = this.chart.append("text")
      .attr("y", -30)
      .attr("x", -(this.height / 2))
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")

    /*var legendGroup = svg.append("g")
      .attr("transform", "translate(" + (this.width - 400) + "," + (this.height - 130) + ")");

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
    */

    /* Add path */
    // Add the line for the first time
    this.path = this.chart.append("path")
      .attr("transform", "translate(" + this.chartOffset + "," + 0 + ")")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px");
  }

  dataPreprocessing() {

    console.log(this.xColumnName)
    /*  Pre processing */

    this.data.forEach(d => {
      d[this.xColumnName] = new Date(d[this.xColumnName]).getTime();
    })
    console.log(this.data);
  }


  updateChart() {
    //this.dataPreprocessing();    
    console.log("update called");
    var t = function () { return d3.transition().duration(1000); }

    let xValue = this.xColumnName;
    let yValue = this.chartParameters.columnName;

    /* filter date */

    let dataFiltered = this.data.filter(d => {
      return (
        d[this.xColumnName] >= this.fromDate && d[this.xColumnName] <= this.toDate
      );
    });

    console.log("Filtered");
    console.log(this.fromDate)
    console.log(this.toDate)
    console.log(dataFiltered)
    //.......................

    // define X & Y domains
    //let xDomain = this.data.map(d => this.parseTime(d[this.xColumnName]));
    let xDomain = d3.extent(dataFiltered, d => d[this.xColumnName]);
    let yDomain = [0, d3.max(dataFiltered, d => d[yValue])];

    console.log(yDomain)
    // create scales
    this.xScale = d3.scaleTime().domain(xDomain).rangeRound([0, this.width - this.axisShortOffset]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height - this.axisShortOffset, 0]);
    console.log(this.height)
    console.log(this.yScale(100));

    //...................................

    // update scales & axis
    //this.xScale.domain(this.data.map(d => d[xValue]));
    //this.yScale.domain([0, d3.max(this.data, d => d[yValue])]);
    //  this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale)
      .tickFormat(d3.timeFormat("%b-%Y")));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    // add labels
    this.yLabel.text(this.chartParameters.yLabel);

    // Clear old tooltips
    d3.select(".focus").remove();
    d3.select(".overlay").remove();

    // Tooltip code
    /*  var focus = this.chart.append("g")
          .attr("class", "focus")
          .style("display", "none");
      focus.append("line")
          .attr("class", "x-hover-line hover-line")
          .attr("y1", 0)
          .attr("y2", this.height);
      focus.append("line")
          .attr("class", "y-hover-line hover-line")
          .attr("x1", 0)
          .attr("x2", this.width);
      focus.append("circle")
          .attr("r", 5);
      focus.append("text")
          .attr("x", 15)
          .attr("dy", ".31em");
      this.chart.append("rect")
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")")
          .attr("class", "overlay")
          .attr("width", this.width)
          .attr("height", this.height)
          .on("mouseover", () => { focus.style("display", null); })
          .on("mouseout", () => { focus.style("display", "none"); })
          .on("mousemove", mousemove);
          
      function mousemove() {
          var x0 = this.xScale.invert(d3.mouse(this)[0]),
              i = this.bisectDate(dataFiltered, x0, 1),
              d0 = dataFiltered[i - 1],
              d1 = dataFiltered[i],
              d = (d1 && d0) ? (x0 - d0[this.xColumnName] > d1[this.xColumnName] - x0 ? d1 : d0) : 0;
          focus.attr("transform", "translate(" + this.xScale(d[this.xColumnName]) + "," + this.yScale(d[this.chartParameters.columnName]) + ")");
          focus.select("text").text(() => { return d3.format("$,")(d[this.chartParameters.columnName].toFixed(2)); });
          focus.select(".x-hover-line").attr("y2",this.height - this.yScale(d[this.chartParameters.columnName]));
          focus.select(".y-hover-line").attr("x2", -this.xScale(d[this.xColumnName]));
      }
 */
    // tooltip v2

    var focus = this.chart.append("g")
      .attr("class", "focus")
      .style("display", "none");

    focus.append("circle")
      .attr("r", 5);

    let tooltip  = focus.append("rect")
      .attr("class", "tooltip")
      .attr("width", 100)
      .attr("height", 50)
      .attr("x", -110)
      .attr("y", -22)
      .attr("rx", 4)
      .attr("ry", 4);

    let tooltip_date = focus.append("text")
      .attr("class", "tooltip-date")
      .attr("x", -108)
      .attr("y", -2);

    let tooltip_label = focus.append("text")
      .attr("x", -108)
      .attr("y", 18)
      .text("Cases:");

    let tooltip_value = focus.append("text")
      .attr("class", "tooltip-likes")
      .attr("x", -65)
      .attr("y", 18);

    this.chart.append("rect")
      .attr("class", "overlay")
      .attr("width", this.width)
      .attr("height", this.height)
      .on("mouseover",() => { focus.style("display", null); })
      .on("mouseout", () => { focus.style("display", "none"); })
      .on("mousemove", mousemove);

      let xScale_copy = this.xScale;
      let yScale_copy = this.yScale;
      let bisectDate = d3.bisector((d) => { return d[this.xColumnName]; }).left; 
      let yColumnName = this.chartParameters.columnName;
      let xColumnName = this.xColumnName;
      let toolTipTime = d3.timeFormat("%d-%m-%Y");
      let chartOffset = this.chartOffset;

      function mousemove() {
        console.log(dataFiltered)
        var x0 = xScale_copy.invert(d3.mouse(this)[0]),
          i = bisectDate(dataFiltered, x0, 1),
          d0 = dataFiltered[i - 1],
          d1 = dataFiltered[i],
          d = x0 - d0[xColumnName] > d1[xColumnName] - x0 ? d1 : d0;
          focus.attr("transform", "translate(" + (chartOffset+xScale_copy(d[xColumnName])) + "," + yScale_copy(d[yColumnName]) + ")");
          console.log(i);
          if(i===1){
            tooltip.attr("transform", "translate(" + (60) + "," + (-40) + ")");
            tooltip_date.attr("transform", "translate(" + (60) + "," + (-40) + ")");
            tooltip_label.attr("transform", "translate(" + (60) + "," + (-40) + ")");
            tooltip_value.attr("transform", "translate(" + (60) + "," + (-40) + ")");
          }  
          else{
             tooltip.attr("transform", "translate(" + (-10) + "," + (20) + ")");
             tooltip_date.attr("transform", "translate(" + (-10) + "," + (20) + ")");
             tooltip_label.attr("transform", "translate(" + (-10) + "," + (20) + ")");
             tooltip_value.attr("transform", "translate(" + (-10) + "," + (20) + ")");                              
          }   
        focus.select(".tooltip-date").text((toolTipTime(d[xColumnName])))
        focus.select(".tooltip-likes").text((d[yColumnName]))
      }


    // Path generator
    let prev=null;
    this.line = d3.area()
      .x(d => this.xScale((d[this.xColumnName])))
      .y0(d => this.yScale(0))  
      .y1(d => {
        prev =  this.yScale(d[this.chartParameters.columnName]);
        return this.yScale(d[this.chartParameters.columnName])
      })
      

    // Update our line path
    this.chart.select(".line")
      .transition(t)
      .attr("fill", "#cce5df")
      .attr("d", this.line(dataFiltered));


    console.log(dataFiltered[0][this.xColumnName])
    console.log(new Date(dataFiltered[0][this.xColumnName]).getTime())
    /*this.chart.append("path")
      .datum(dataFiltered)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
        .x(d => this.xScale(d[this.xColumnName]))
        .y(d => this.yScale(d[this.chartParameters.columnName]))
      )*/
  }

  getData(postData) {
    this.http.post<any>("http://localhost:3000/" + this.chartParameters.data, postData)
      .subscribe(responseData => {
        console.log("Data received before");
        this.data = responseData;
        console.log(this.data);
        this.dataPreprocessing();
        this.updateChart();
      })
  }

   



}
