import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

@Component({
  selector: 'app-histogram',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './histogram.component.html',
  styleUrl: './histogram.component.scss'
})
export class HistogramComponent {
  private chart: am4charts.XYChart | undefined
  constructor(private zone:NgZone){}
  
  ngOnInit():void{
    this.zone.runOutsideAngular(()=>{
    /* Chart code */
    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    // Create chart instance
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.logo.__disabled=true;
    
    // Add data
    chart.data = [{ "date": "2023-01-01T00:00:00", "landed": 5 },
    { "date": "2023-01-02T00:00:00", "landed": 7 },
    { "date": "2023-01-03T00:00:00", "landed": 3 },
    { "date": "2023-01-04T00:00:00", "landed": 10 },
    { "date": "2023-01-05T00:00:00", "landed": 8 },
    { "date": "2023-01-06T00:00:00", "landed": 6 },
    { "date": "2023-01-07T00:00:00", "landed": 12 },
    { "date": "2023-01-08T00:00:00", "landed": 9 },
    { "date": "2023-01-09T00:00:00", "landed": 7 },
    { "date": "2023-01-10T00:00:00", "landed": 11 },
    { "date": "2023-01-11T00:00:00", "landed": 15 },
    { "date": "2023-01-12T00:00:00", "landed": 13 },
    { "date": "2023-01-13T00:00:00", "landed": 10 },
    { "date": "2023-01-14T00:00:00", "landed": 8 },
    { "date": "2023-01-15T00:00:00", "landed": 6 },
    { "date": "2023-01-16T00:00:00", "landed": 9 },
    { "date": "2023-01-17T00:00:00", "landed": 12 },
    { "date": "2023-01-18T00:00:00", "landed": 14 },
    { "date": "2023-01-19T00:00:00", "landed": 10 },
    { "date": "2023-01-20T00:00:00", "landed": 16 }];
    
    // Create axes
    
    const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50; // Adjust based on your data density
    dateAxis.title.text = "LPI";
    dateAxis.dateFormats.setKey("day", "yyyy-MM-dd\nHH:mm:ss");
    dateAxis.periodChangeDateFormats.setKey("day", "yyyy-MM-dd\nHH:mm:ss");
    
    const valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = "# of times scenario landed on LPI";
    
    // Create series
    const series = chart.series.push(new am4charts.ColumnSeries());
    series.dataFields.valueY = "landed";
    series.dataFields.dateX = "date";
    series.columns.template.tooltipText  = "Date: {date}\nNumber of Times Landed: {landed}";
    series.columns.template.width = am4core.percent(100);

    chart.responsive.enabled = true;
    
    let columnTemplate = series.columns.template;
    columnTemplate.strokeWidth = 2;
    columnTemplate.strokeOpacity = 1;
    
    })
  }
  ngOnDestroy(){
    this.zone.runOutsideAngular(()=>{
      if(this.chart){
        this.chart.dispose();
      }
    })
  }
}
