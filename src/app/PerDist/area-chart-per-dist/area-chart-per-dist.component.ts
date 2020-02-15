import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation, Input } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { LineChartPerDistParameters } from '../../model/linechartPerDistParameters.model';
import { LineChartPerDistService } from '../../services/lineChartPerDist.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AreaChartPerDistService } from 'src/app/services/areaChartPerDist.service';
import { AreaChartPerDistParameters } from 'src/app/model/areaChartPerDistParameters.model';



@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-area-chart-per-dist',
  templateUrl: './area-chart-per-dist.component.html',
  styleUrls: ['./area-chart-per-dist.component.css']
})
export class AreaChartPerDistComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;
  public data: Array<any> = [];
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
  private chartParameters: AreaChartPerDistParameters;
  private yLabel: any;
  private xLabel: any;
  private parseTime = d3.timeParse("%Y-%m-%d");
  private formatTime = d3.timeFormat("%Y-%m-%d");
  private fromDate: any;
  private toDate: any;
  private path: any;
  private line: d3.Line<[number, number]>; // this is line defination
  private year:number;
  private district:string;

  private dataURL:any;
  private xColumnName:string;
  private granular:number;
  private choosenValue:number;
  private monthName:string;
  private months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  private queryData:any;

  constructor(private http: HttpClient, private areaChartService: AreaChartPerDistService, private titleService: Title,
      private route:ActivatedRoute) { }

  ngOnInit() {
    console.log("Getting areachart.............");
    this.chartParameters = this.areaChartService.getParameters(); 
    console.log(this.chartParameters);
  
    this.titleService.setTitle(this.chartParameters.yLabel);
    console.log(this.chartParameters);   
    this.createChart();
    this.areaChartService.getParametersUpdateListener().subscribe( (d)=>{
      console.log("Chart parameter updated")
      this.chartParameters = this.areaChartService.getParameters();
      this.updateChart();
    })

    this.areaChartService.getChartDataListener().subscribe((d) => {
      console.log("AreaChart Data changed");
      console.log(d);
      this.data = d.data;
      this.year = d.year;
      this.granular = d.granular;
      this.choosenValue = d.choosenValue;
      this.xColumnName = d.xColumnName;
      if (this.granular == 2)
        this.monthName = this.months[this.choosenValue-1];
      this.updateChart();
    })

    this.dataURL = this.chartParameters.dataURL;
    this.queryData = {
      dataURL : this.dataURL,
      districtId : this.chartParameters.districtId
    }
    console.log("Query data")
    console.log(this.queryData);
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

  updateChart() {
    //this.dataPreprocessing();    
    console.log("update called");
    console.log(this.year);
    var t = function () { return d3.transition().duration(1000); }

    let xValue = this.xColumnName;
    let yValue = this.chartParameters.yColumnName;

    let dataFiltered  = this.data;
    //.......................

    // define X & Y domains
    //let xDomain = this.data.map(d => this.parseTime(d[this.xColumnName]));
    console.log(this.xColumnName);
    let xDomain = dataFiltered.map( (d) => d[this.xColumnName]);
    let yDomain = [0, d3.max(dataFiltered, d => d[yValue])];

    console.log(yDomain)
    // create scales
    this.xScale = d3.scaleBand().domain(xDomain).rangeRound([0, this.width - this.axisShortOffset]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height - this.axisShortOffset, 0]);
    console.log(this.height)
    console.log(this.yScale(100));

    //...................................

    // update scales & axis
    //this.xScale.domain(this.data.map(d => d[xValue]));
    //this.yScale.domain([0, d3.max(this.data, d => d[yValue])]);
    //  this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale))
    //  .tickFormat(d3.timeFormat("%b-%Y")));
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
/*
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
      let yColumnName = this.chartParameters.yColumnName;
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
*/

    // Path generator
    let prev=null;
    this.line = d3.area()
      .x(d => this.xScale((d[this.xColumnName])))
      .y0(d => this.yScale(0))  
      .y1(d => {
        prev =  this.yScale(d[this.chartParameters.yColumnName]);
        return this.yScale(d[this.chartParameters.yColumnName])
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

}

