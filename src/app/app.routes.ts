import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { FontsComponent } from './fonts/fonts.component';
import { CodeFormatterComponent } from './code-formatter/code-formatter.component';
import { ChartComponent } from './chart/chart.component';
import { HistogramComponent } from './histogram/histogram.component';

export const routes: Routes = [
    {
        path:'icons',component:FontsComponent
    },
    {
        path:'code-formatter',component:CodeFormatterComponent
    },
    // {
    //     path:'chart',component:ChartComponent
    // },
    // {
    //     path:'histogram',component:HistogramComponent
    // }
];
