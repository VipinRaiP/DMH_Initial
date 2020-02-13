import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { MatSliderModule, MatNativeDateModule, MatInputModule, MatRadioModule } from '@angular/material'
import { BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Ng5SliderModule} from 'ng5-slider';
import {MatDatepickerModule,MatFormFieldModule} from '@angular/material';

import { AppComponent } from './app.component';
import { BarChartAllDistComponent } from './AllDist/bar-chart-all-dist/bar-chart-all-dist.component';
import { AppRoutingModule } from './app-routing.module';
import { HomeComponentComponent } from './home-component/home-component.component';
import { BarChartAllDistService } from './services/barchartAllDist.service';
import { LineChartPerDistComponent } from './PerDist/line-chart-per-dist/line-chart-per-dist.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LineChartPerDistService } from './services/lineChartPerDist.service';
import { GranularComponent } from './AllDist/granular/granular.component';
import { ModalModule} from '../app/services/_modal';
import { HeaderComponent } from './header/header.component';
import { AllDistMenuComponent } from './AllDist/all-dist-menu/all-dist-menu.component';
import { GranularPerDistComponent } from './PerDist/granular-per-dist/granular-per-dist.component';
import { PerDistMenuComponent } from './PerDist/per-dist-menu/per-dist-menu.component';
import { BarChartStateComponent } from './StateView/bar-chart-state/bar-chart-state.component';
import { StateViewMenuComponent } from './StateView/state-view-menu/state-view-menu.component';
import { StateViewGranularComponent } from './StateView/state-view-granular/state-view-granular.component';
import { BarChartStateService } from './services/bar-chart-state.service';
import { AreaChartPerDistComponent } from './PerDist/area-chart-per-dist/area-chart-per-dist.component';
import { AreaChartPerDistService } from './services/areaChartPerDist.service';


@NgModule({
  declarations: [
    AppComponent,
    BarChartAllDistComponent,
    HomeComponentComponent,
    LineChartPerDistComponent,
    GranularComponent,
    HeaderComponent,
    AllDistMenuComponent,
    GranularPerDistComponent,
    PerDistMenuComponent,
    BarChartStateComponent,
    StateViewMenuComponent,
    StateViewGranularComponent,
    AreaChartPerDistComponent,
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
    MatRadioModule,
    ModalModule
  ],
  providers: [BarChartAllDistService,
              LineChartPerDistService,
              BarChartStateService,
              Title,
              AreaChartPerDistService
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
