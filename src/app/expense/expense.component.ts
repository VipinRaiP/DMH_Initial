import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css']
})
export class ExpenseComponent implements OnInit {
  @ViewChild('chart', { static: true }) private chartContainer: ElementRef;

  private year: number = 2019;
  private margin: any = { top: 20, right: 20, bottom: 30, left: 40 };
  private width: number;
  private height: number;
  private g: any;
  private xAxis: any;
  private yAxis: any;
  private chartOffset: number = 30;
  private axisShortOffset: number = 100;
  private x: any;
  private y: any;
  private yScaleLine :any;
  private z: any;
  private svg:any;
  yLabel: any;
  xLabel: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getYearlyData(this.year);
    //this.createChart();
  }


  getYearlyData(year: number) {
    console.log(year)
    let postData = {
      year: year

    }


    this.http.post<any>("http://localhost:3000/getYearlyExpenseDistrictwise", postData)
      .subscribe(responseData => {
        console.log("Expense Data received");
        console.log(responseData);
        this.createChart();
        this.updateChart(responseData);
      })


      this.http.post<any>("http://localhost:3000/getYearlyExpenseDistrictwiselineChart", postData)
      .subscribe(responseData => {
       // console.log("Expense Data received");
        console.log(responseData);
        //this.createChart();
        this.createLineChart(responseData);
      })

  }


  createChart() {
    // create the svg
    let element = this.chartContainer.nativeElement;
    // var svg = d3.select("svg");

    // this.width = +element.attr("width") - this.margin.left - this.margin.right,
    // this.height = +element.attr("height") - this.margin.top - this.margin.bottom,
    // this.g = element.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


    this.svg = d3.select(element)
      .append('svg')
      .attr('width', element.offsetWidth+ 300)
      .attr('height', element.offsetHeight+60);

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
   
    console.log(this.height);

    // chart plot area
    this.g = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.xLabel = this.g.append("text")
    .attr("y", this.height + 60)
    .attr("x", this.width / 2 - 30)
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .text("Districts");

  // Y Label
  this.yLabel = this.g.append("text")
    .attr("y", -25)
    .attr("x", -(this.height/2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Expense (in Lakhs)")
// Y label Total cases
    this.yLabel = this.g.append("text")
    .attr("y", this.width + 60)
    .attr("x", -(this.height/2))
    .attr("font-size", "20px")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Total Cases")
    //   // x & y axis
    // this.xAxis = this.g.append('g')
    // .attr('class', 'x axis')
    // .attr('transform', `translate(${this.chartOffset}, ${this.height - this.axisShortOffset})`)

    // this.yAxis = this.g.append('g')
    // .attr('class', 'axis axis-y')
    // .attr('transform', `translate(${this.chartOffset},0)`)

    // set x scale
    this.x = d3.scaleBand()
      // .rangeRound([0, this.width])
      .range([0,this.width]);
      // .paddingInner(0.05)
      // .align(0.1);

    // set y scale
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);


    //line chart

 

    // set the colors
    this.z = d3.scaleOrdinal()
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00","#0B0B3B",
      "#80FF00","#000000","#FF4000","#54409D","#8267E5","#F318C3","#0000FF","#01A9DB","#DF7401","#F5A9A9",
      "#A9F5F2","#DF01D7","#084B8A","#2E3B0B"]);

  }

  updateChart(data) {
    let columns = [];
    for (var k in data[0]) {
      columns.push(k);
    }

    for (var d1 of data) {
      var tot = 0;
      for (var j = 1; j < columns.length; j++) {
        tot += d1[columns[j]];
      }
      d1.total = tot;
    }


    var keys = columns.slice(1);
    //console.log("KKKKKKKKKEYS: "+keys);


    let max = 0;
    for (let d of data) {
      if (d.total > max) {
        max = d.total;
      }
    }
 console.log(d3.stack().keys(keys)(data));
    let yDomain = [0, d3.max(data, d => d["total"])];
    let xDomain = data.map(function (d) { return d.District; });

    this.x.domain(xDomain).padding(0.3);
    this.y.domain(yDomain).nice();
    this.z.domain(keys);

      //console.log(this.z("sum(J18_InnovationMH)"));
    this.g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.x))
      .selectAll("text")
      .attr("y", "3")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");

    this.g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(this.y).ticks(null, "s"))
      .append("text")
      .attr("x", 2)
      .attr("y", this.y(this.y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start");


      this.g.append("g")
    .selectAll("g")
    .data(d3.stack().keys(keys)(data))
    .enter().append("g")
      .attr("fill", d => this.z(d.key))
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      // .attr("x", function(d) { return this.x(d.data.District); })
      .attr('x', d => this.x(d.data.District))
      .attr('y', d => this.y(d[1]))
      // .attr("y", function(d) { return this.y(d[1]); })
      .attr('width', d => this.x.bandwidth())
      .attr('height', d => this.y(d[0]) - this.y(d[1]))
      // .attr("height", function(d) { return this.y(d[0]) - this.y(d[1])  ; })
      // .attr("width", this.x.bandwidth())
    
      .data(d3.stack().keys(keys)(data))
    .on("mouseover", function() { tooltip.style("display", null); })
    .on("mouseout", function() { tooltip.style("display", "none"); })
    .on("mousemove", function(d) {
      console.log(d);
      var xPosition = d3.mouse(this)[0] - 5;
      var yPosition = d3.mouse(this)[1] - 5;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.key);
    });

    var legend = this.g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
  .selectAll("g")
  .data(keys.slice().reverse())
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

legend.append("rect")
    .attr("x", this.width +180)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", this.z);

legend.append("text")
    .attr("x", this.width + 170)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .attr("font-size", "11px")
    .text(function(d) { return d; });

  // Prep the tooltip bits, initial display is hidden
  var tooltip = this.svg.append("g")
  .attr("class", "tooltip")
  .style("display", "none");
    
tooltip.append("rect")
  .attr("width", 60)
  .attr("height", 20)
  .attr("fill", "white")
  .style("opacity", 0.5);

tooltip.append("text")
  .attr("x", 30)
  .attr("dy", "1.2em")
  .style("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("font-weight", "bold");

  }

  createLineChart(data)
  {
    let yDomain = [0, d3.max(data, d => d["total"])];
    //let xDomain = data.map(function(d) { return d.district; });

    this.yScaleLine = d3.scaleLinear()
    .range([this.height, 0]); // output 
    
    this.yScaleLine.domain(yDomain);

    // console.log(xDomain);
    // var xScale = d3.scaleBand()
    // .domain(xDomain) // input
    // .range([0, this.width]); // output

    var line = d3.line()
    .x( d=> this.x(d["district"])+ (this.x.bandwidth()/2)   ) // set the x values for the line generator
    .y( d=> this.yScaleLine(d["total"]) ) // set the y values for the line generator 
    .curve(d3.curveMonotoneX) // apply smoothing to the line
    console.log(line);

    //y axis in a group tag
    this.g.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate("+ this.width+", 0 )")
    .call(d3.axisRight(this.yScaleLine)); // Create an axis component with d3.axisLeft

    this.g.append("path")
    .datum(data) // 10. Binds data to the line 
    .attr("class", "line") // Assign a class for styling 
    .attr("d", line)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 3); // 11. Calls the line generator

    this.g.selectAll(".dot")
    .data(data)
  .enter().append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", d=> this.x(d.district)+ (this.x.bandwidth()/2)  )
    .attr("cy", d=> this.yScaleLine(d.total) )
    .attr("r", 5)
    .attr("fill","blue");

  }

}
