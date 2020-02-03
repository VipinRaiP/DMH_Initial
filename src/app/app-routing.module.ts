import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { BarChartAllDistComponent } from './AllDist/bar-chart-all-dist/bar-chart-all-dist.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { LineChartPerDistComponent } from './PerDist/line-chart-per-dist/line-chart-per-dist.component';
import { AllDistMenuComponent } from './AllDist/all-dist-menu/all-dist-menu.component';
import { PerDistMenuComponent } from './PerDist/per-dist-menu/per-dist-menu.component';

const appRoutes :Routes = [
    {path: 'barChartAllDist',component:BarChartAllDistComponent},
    {path: 'lineChartPerDist',component:LineChartPerDistComponent},
    {path:'',component:HomeComponentComponent},
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