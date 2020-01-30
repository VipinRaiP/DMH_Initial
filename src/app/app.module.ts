import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { MatSliderModule, MatNativeDateModule, MatInputModule, MatRadioModule } from '@angular/material'
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Ng5SliderModule} from 'ng5-slider';
import {MatDatepickerModule,MatFormFieldModule} from '@angular/material';

import { AppComponent } from './app.component';
import { BarChartAllDistComponent } from './bar-chart-all-dist/bar-chart-all-dist.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponentComponent } from './home-component/home-component.component';
import { BarChartAllDistService } from './services/barchartAllDist.service';
import { LineChartPerDistComponent } from './line-chart-per-dist/line-chart-per-dist.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LineChartPerDistService } from './services/lineChartPerDist.service';


@NgModule({
  declarations: [
    AppComponent,
    BarChartAllDistComponent,
    HomeComponentComponent,
    LineChartPerDistComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatSliderModule,
    Ng5SliderModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule, 
    MatRadioModule 
  ],
  providers: [BarChartAllDistService,
              LineChartPerDistService,
              Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
