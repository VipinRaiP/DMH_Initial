import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-line-chart-card',
  templateUrl: './line-chart-card.component.html',
  styleUrls: ['./line-chart-card.component.css']
})
export class LineChartCardComponent implements OnInit {

  @ViewChild('smallChart', { static: true }) private chartContainer: ElementRef;
  @Input() CardName: String;
  @Input() total_cases: number;
  @Input() data: any;

  private year: number = 2019;
  private margin: any = { top: 25, right: 20, bottom: 30, left: 5 };
  private width: number;
  private height: number;
  private g: any;
  private x: any;
  private y: any;
  private yScaleLine: any;
  yLabel: any;
  xLabel: any;
  private svg: any;

  expenseData: any;



  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getData();

  }

  getData() {

    if (this.CardName == "Alcohol Cases") {

      this.http.get<any>("http://localhost:3000/getAlcoholDash")
        .subscribe(responseData => {

          this.createChart();
          this.createLineChart(responseData);

        })
    }
    else if (this.CardName == "SMD Cases") {
      this.http.get<any>("http://localhost:3000/getSMDDash")
        .subscribe(responseData => {

          this.createChart();
          this.createLineChart(responseData);

        })
    }
    else if (this.CardName == "CMD Cases") {
      this.http.get<any>("http://localhost:3000/getCMDDash")
        .subscribe(responseData => {

          this.createChart();
          this.createLineChart(responseData);

        })
    }
    else if (this.CardName == "Suicide Cases") {
      this.http.get<any>("http://localhost:3000/getSuicideDash")
        .subscribe(responseData => {

          this.createChart();
          this.createLineChart(responseData);

        })
    }
  }


  createChart() {
    // create the svg
    let element = this.chartContainer.nativeElement;

    this.svg = d3.select(element)
      .append('svg')
      // .attr('width', 500)
      .attr('height', 60);

    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    //console.log(this.height);

    // chart plot area
    this.g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);


    // set x scale
    this.x = d3.scaleBand()
      .range([0, this.width]);


    // set y scale
    this.y = d3.scaleLinear()
      .rangeRound([this.height, 0]);

  }

  createLineChart(data) {
    //let yDomain = [0, d3.max(data, d => d["total"])];
    //let xDomain = data.map(function(d) { return d.district; });

    let yDomain = [0, d3.max(data, d => d["total"])];
    let xDomain = data.map(function (d) { return d["district"]; });

    this.x.domain(xDomain).padding(0.3);
    this.y.domain(yDomain).nice();


    this.yScaleLine = d3.scaleLinear()
      .range([this.height, 0]); // output 

    this.yScaleLine.domain(yDomain);

    var line = d3.line()
      .x(d => this.x(d["district"]) + (this.x.bandwidth() / 2)) // set the x values for the line generator
      .y(d => this.yScaleLine(d["total"])) // set the y values for the line generator 
      .curve(d3.curveMonotoneX) // apply smoothing to the line
    console.log(line);




    this.g.append("path")
      .datum(data) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "lightgrey")
      .attr("stroke-width", 4);
    //.attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);; // 11. Calls the line generator

    this.g.append("path")
      .datum(data) // 10. Binds data to the line 
      .attr("class", "line") // Assign a class for styling 
      .attr("d", line)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5); // 11. Calls the line generator
  }
}
