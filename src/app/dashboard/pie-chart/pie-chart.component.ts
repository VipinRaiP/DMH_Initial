import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import * as d3 from 'd3';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  public width: number;
  public height: number;
  public margin: number;
  public radius: number;
  public svg: any;
  public colorScale: any;
  @Input()
  public chartData;
  public dataKeys;
  public arc: any;
  public tooltip: any;
  public legend: any;
  public chartArea:any;
  @Input()
  public chartAreaId: any;

  public id = "random123";
  constructor() { }

  ngOnInit() {
    console.log("Pie Chart Data");
    console.log(this.chartData);
    console.log("Chart Id : " + this.chartAreaId);
    this.dataKeys = Object.keys(this.chartData);
    this.createChart();
    this.updateChart();
  }

  createChart() {

    this.width = 235
    this.height = 276
    this.margin = 10
    //The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
    this.radius = Math.min(this.width, this.height) / 2 - this.margin

    // append the svg object to the div called 'my_dataviz'
    let chartId: string = "#" + this.chartAreaId;
    console.log("chart Id : " + chartId);

    this.svg = d3.select("#pie-chart-area")
      .append("svg")
      .attr("width",235)
      .attr("height",450)
      
    this.chartArea  =  this.svg.append("g")
      .attr("width", this.width)
      .attr("height", this.height)
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

    // set color scale  
    this.colorScale = d3.scaleOrdinal()
      //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"])
      .range(d3.schemeDark2);

    // Tooltip

    this.tooltip = d3.select("#pie-chart-area")
      .append('div')
      .attr('class', 'tooltip')
      .style('display', 'none');

    // Legend

    this.legend = this.svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (-50) + "," + 300 + ")")
      .attr("x", 165)
      .attr("y", 25 )
      .attr("height", 100)
      .attr("width", 100);
  }

  updateChart() {
    const pie = d3.pie()
    // .value((d:any) => { return d.value})
    //  .sort(function (a:any, b:any) { console.log(a); return d3.ascending(a.key, b.key); }) // This make sure that group order remains the same in the pie chart

    //let data_ready = pie(d3.entries(this.chartData))
    console.log(Object.values(this.chartData));
    console.log(d3.entries(this.chartData));
    let data = pie(Object.values(this.chartData));

    console.log("Update received");
    console.log(this.chartData);
    console.log(Object.keys(this.chartData));

    // update domain
    this.colorScale.domain(this.chartData)

    // update legend

    // map to data
    var u = this.chartArea.selectAll('.chart-arc')
      .data(data)

    let color = this.colorScale;
    let dataKeys = Object.keys(this.chartData);
    let dataValues = Object.values(this.chartData);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    u.enter()
      .append('path')
      .attr('class', 'chart-arc')
      //.merge(u)
      //.transition()
      //.duration(1000)
      .attr('d', d3.arc()
        .innerRadius(this.radius - 50)
        .outerRadius(this.radius)
      )
      .attr('fill', function (d, i) {
        console.log(dataKeys[i]);
        console.log(dataValues[i]);
        return (color(i))
      })
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 1)
      .on('mouseover', mouseover.bind(this))
      .on('mousemove', mousemove.bind(this))
      .on('mouseout', mouseout.bind(this))

    // remove the group that is not present anymore
    u.exit()
      .remove()

    // Tool tip function calls

    // Tooltip code

    function mouseover() {
      console.log(this)
      this.tooltip
        .style('display', 'block')
      //.style('position', 'absolute')
      //.style('display', null);
    }

    function mousemove(d) {
      console.log(dataKeys[d.index])
      this.tooltip
        .html("<div class='tooltip-box' align='center'}>" + dataKeys[d.index] + " : " + dataValues[d.index] + "</div>")
        //.text([dataKeys[d.index], dataValues[d.index]].join(','))
        .style('left', d3.event.pageX - 1430 + "px")
        .style('top', d3.event.pageY - 230 + "px");
    }

    function mouseout() {
      this.tooltip
        .style('display', 'none');
    }

    // Add legends

    console.log(data)

    this.legend.selectAll('rect')
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 100)
      .attr("y", (d,i)=> i*20)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function (d, i) { 
        return color(d.index) });
    this.legend.selectAll('text')
      .data(data)
      .enter()          
      .append("text")
      .attr("x", 130)
      .attr("y", (d,i)=> 10+i*20)
      .text(function (d, i) { return dataKeys[d.index] })




  }
}
