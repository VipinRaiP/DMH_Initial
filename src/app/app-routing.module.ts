import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { BarChartAllDistComponent } from './AllDist/bar-chart-all-dist/bar-chart-all-dist.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { LineChartPerDistComponent } from './PerDist/line-chart-per-dist/line-chart-per-dist.component';
import { AllDistMenuComponent } from './AllDist/all-dist-menu/all-dist-menu.component';
import { PerDistMenuComponent } from './PerDist/per-dist-menu/per-dist-menu.component';
import { StateViewMenuComponent } from './StateView/state-view-menu/state-view-menu.component';
import { BarChartStateComponent } from './StateView/bar-chart-state/bar-chart-state.component';
import { RadarChartComponent } from './RadarChart/radar-chart/radar-chart.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const appRoutes :Routes = [
    {path: 'barChartAllDist',component:BarChartAllDistComponent},
    {path: 'lineChartPerDist',component:LineChartPerDistComponent},
    {path:'',component:HomeComponentComponent},
    {path:'radarChart',component:RadarChartComponent},
    {
        path:'allDist',
        component:AllDistMenuComponent,
        children:[
            {path:'barChart',component:BarChartAllDistComponent}
        ]    
    },
    {
        path:'perDist',
        component:PerDistMenuComponent,
        children:[
            {path:'lineChart',component:LineChartPerDistComponent}
        ]    
    },
    {
        path: 'stateView',
        component : StateViewMenuComponent,
        children :[
            {path:'barChart', component: BarChartStateComponent},
        ]
    },
    { 
        path:'distView/:paramNumber',
        component:AllDistMenuComponent
    },
    {
        path:'perDistView/:distId',
        component: PerDistMenuComponent
    },
    {
        path:'dashboard',
        component: DashboardComponent
    }
];

@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule{

}