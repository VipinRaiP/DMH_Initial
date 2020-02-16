import { Component, OnInit,ViewChild, ElementRef, Input } from '@angular/core';
import * as d3 from 'd3';
import { MapService } from './main-map.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-main-map',
  templateUrl: './main-map.component.svg',
  styleUrls: ['./main-map.component.css']
})
export class MainMapComponent implements OnInit {

  // @ViewChild('Haveri', { static: true }) private chartContainer: ElementRef;

 // private mysore : District = new District("Mysore"," ",0,"");

  @Input() viewBoxDims:string ;//= "1500 -2000 22000 30700";

  private mapElement: any;  
  private year:number;
  mycolor1 = "red";
  mycolor2 = "green";
  tooltipText = "HtmlContent:name <br> cases: 5566";
  private newData :any = {};

  constructor(private http:HttpClient,private mapService : MapService) { }

  ngOnInit() {

    this.initialiseColor();
    this.mapService.onYearChanged.subscribe(
      (year:number) =>{
        this.getData(year);
      }
    )

  }


  getData(nyear:number)
  {
    let postData = {
      year: nyear,
    }
    this.http.post<any>("http://localhost:3000/getAlcoholYearlyDistrictforMap", postData)
    .subscribe(responseData => {
     console.log("Year Data received");
     console.log(responseData);
     this.updateMapColors(responseData) 
    })
  }


  updateMapColors(mapData)
  {
    this.initialiseColor();
      for(var data of mapData)
      {
        let color;

          if(data.total_alcohol_cases < 1000)
          {
            color = "#ff6666"
          }
          else if(data.total_alcohol_cases >1000 && data.total_alcohol_cases < 3000)
          {
            color = "#ff1a1a"
          }
          else
          {
            color = "#cc0000";
          }


        if(data.Districtid == "Haveri")
        {
          this.newData["Haveri"] = color;
        }
        else if (data.Districtid == "Davanagere")
        {
          this.newData["Davanagere"] = color;
        }
        else if (data.Districtid == "Koppal")
        {
          this.newData["Koppal"] = color;
        }
        else if (data.Districtid == "Bellary")
        {
          this.newData["Bellary"] = color;
        }
        else if (data.Districtid == "Belgaum")
        {
          this.newData["Belgaum"] = color;
        }
        else if (data.Districtid == "Gadag")
        {
          this.newData["Gadag"] = color;
        }
        else if (data.Districtid == "Dharwad")
        {
          this.newData["Dharwad"] = color;
        }
        else if (data.Districtid == "Bagalkote")
        {
          this.newData["Bagalkote"] = color;
        }
        else if (data.Districtid == "Udupi")
        {
          this.newData["Udupi"] = color;
        }
        else if (data.Districtid == "Uttara Kannada")
        {
          this.newData["Uttara_Kannada"] = color;
        }
        else if (data.Districtid == "Shimoga")
        {
          this.newData["Shimoga"] = color;
        }
        else if (data.Districtid == "Tumkur")
        {
          this.newData["Tumkur"] = color;
        }
        else if (data.Districtid == "Chikmagalur")
        {
          this.newData["Chikmagalur"] = color;
        }
        else if (data.Districtid == "Chitradurga")
        {
          this.newData["Chitradurga"] = color;
        }
        else if (data.Districtid == "Kodagu")
        {
          this.newData["Kodagu"] = color;
        }
        else if (data.Districtid == "Dakshina Kannada")
        {
          this.newData["Dakshina_Kannada"] = color;
        }
        else if (data.Districtid == "Hassan")
        {
          this.newData["Hassan"] = color;
        }
        else if (data.Districtid == "Uttara Kannada")
        {
          this.newData["Uttara_Kannada"] = color;
        }
        else if (data.Districtid == "Chamrajnagar")
        {
          this.newData["Chamrajnagar"] = color;
        }
        else if (data.Districtid == "Mysore")
        {
          this.newData["Mysore"] = color;
        }
        else if (data.Districtid == "Mandya")
        {
          this.newData["Mandya"] = color;
        }
        else if (data.Districtid == "Bangalore Urban")
        {
          this.newData["Bangalore_Urban"] = color;
        }
        else if (data.Districtid == "Ramanagar")
        {
          this.newData["Ramanagara"] = color;
        }
        else if (data.Districtid == "Kolar")
        {
          this.newData["Kolar"] = color;
        }
        else if (data.Districtid == "Bangalore Rural")
        {
          this.newData["Bangalore_Rural"] = color;
        }
        else if (data.Districtid == "Chikkaballapur")
        {
          this.newData["Chikkaballapur"] = color;
        }
        else if (data.Districtid == "Yadgir")
        {
          this.newData["Yadgir"] = color;
        }
        else if (data.Districtid == "Raichur")
        {
          this.newData["Raichur"] = color;
        }
        else if (data.Districtid == "Bijapur")
        {
          this.newData["Bijapur"] = color;
        }
        else if (data.Districtid == "Bidar")
        {
          this.newData["Bidar"] = color;
        }
        else if (data.Districtid == "Gulbarga")
        {
          this.newData["Gulbarga"] = color;
        }


      }

      console.log(this.newData);
  }

  displayName(name) {

    this.tooltipText = "Name: " + name +"<br>" + "Cases: 2000 " ;
    //console.log(name);
    // document.getElementById('country-name').firstChild.data = name;
}


districtSelected(district){
  this.mapService.onDistrictSelected.emit(district);
}

initialiseColor()
{
 
  let color = "#808080";

          this.newData["Haveri"] = color;
      
          this.newData["Davanagere"] = color;
       
          this.newData["Koppal"] = color;
        
          this.newData["Bellary"] = color;
       
          this.newData["Belgaum"] = color;
       
          this.newData["Gadag"] = color;
        
          this.newData["Dharwad"] = color;
        
          this.newData["Bagalkote"] = color;
       
          this.newData["Udupi"] = color;
       
          this.newData["Uttara_Kannada"] = color;
       
          this.newData["Shimoga"] = color;
       
          this.newData["Tumkur"] = color;
       
          this.newData["Chikmagalur"] = color;
       
          this.newData["Chitradurga"] = color;
        
          this.newData["Kodagu"] = color;
       
          this.newData["Dakshina_Kannada"] = color;
        
          this.newData["Hassan"] = color;
        
          this.newData["Uttara_Kannada"] = color;
       
          this.newData["Chamrajnagar"] = color;
       
          this.newData["Mysore"] = color;
       
          this.newData["Mandya"] = color;
        
          this.newData["Bangalore_Urban"] = color;
       
          this.newData["Ramanagara"] = color;
        
          this.newData["Kolar"] = color;
       
          this.newData["Bangalore_Rural"] = color;
        
          this.newData["Chikkaballapur"] = color;
       
          this.newData["Yadgir"] = color;
       
          this.newData["Raichur"] = color;
        
          this.newData["Bijapur"] = color;
        
          this.newData["Bidar"] = color;
        
          this.newData["Gulbarga"] = color;
   
}

}
