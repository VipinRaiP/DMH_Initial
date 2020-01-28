import { Routes, RouterModule } from "@angular/router";
import { NgModule } from '@angular/core';
import { BarChartAllDistComponent } from './bar-chart-all-dist/bar-chart-all-dist.component';
import { HomeComponentComponent } from './home-component/home-component.component';
import { LineChartPerDistComponent } from './line-chart-per-dist/line-chart-per-dist.component';

const appRoutes :Routes = [
    {path: 'barChartAllDist',component:BarChartAllDistComponent},
    {path: 'lineChartPerDist',component:LineChartPerDistComponent},
    {path:'',component:HomeComponentComponent}
];

@NgModule({
    imports:[
        RouterModule.forRoot(appRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule{

}