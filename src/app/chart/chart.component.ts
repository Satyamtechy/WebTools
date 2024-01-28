import { AfterViewInit, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as am4charts from '@amcharts/amcharts4/charts'
import * as am4core from '@amcharts/amcharts4/core'
import am4themes_animated from '@amcharts/amcharts4/themes/animated'

type DataItem = {
  color: any;
  site: string;
  category: string;
  start: string;
  end: string;
};

type Detail = {
  category: string;
  start: string;
  end: string;
  site: string;
  color:any;
};

type GroupedItem = {
  site: string;
  series: string;
  details: Detail[];
};

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.scss'
})
export class ChartComponent implements AfterViewInit{

  private chart!: am4charts.XYChart;
  private chartInstance:am4charts.XYChart[]=[];
  sitesData: any[] = [
    {
      "site": "site1",
      "data": [
        {
          "category": "contract",
          "start": "2023-01-01T08:00:00",
          "end": "2023-01-10T17:00:00",
          "site": "site1",
        },
        {
          "category": "siv",
          "start": "2023-01-01T08:00:00",
          "end": "2023-01-20T17:00:00",
          "site": "site1",
        },
        {
          "category": "resource",
          "start": "2023-02-01T08:00:00",
          "end": "2023-02-10T17:00:00",
          "site": "site1",
        },
        {
          "category": "enrollment",
          "start": "2023-02-11T08:00:00",
          "end": "2023-02-20T17:00:00",
          "site": "site1",
        },
      ]
    },
    {
      "site": "site2",
      "data": [
        {
          "category": "contract",
          "start": "2023-01-01T08:00:00",
          "end": "2023-01-10T17:00:00",
          "site": "site2",
        },
        {
          "category": "siv",
          "start": "2023-01-01T08:00:00",
          "end": "2023-01-30T17:00:00",
          "site": "site2",
        },
        {
          "category": "resource",
          "start": "2023-01-01T08:00:00",
          "end": "2023-01-10T17:00:00",
          "site": "site2",
        },
        {
          "category": "enrollment",
          "start": "2023-01-01T08:00:00",
          "end": "2023-01-10T17:00:00",
          "site": "site2",
        },
      ]
    },
    {
      "site": "site3",
      "data": [
        {
          "category": "contract",
          "start": "2023-01-01T08:00:00",
          "end": "2023-01-10T17:00:00",
          "site": "site3",
        },
        {
          "category": "siv",
          "start": "2023-01-25T08:00:00",
          "end": "2023-01-30T17:00:00",
          "site": "site3",
        },
        {
          "category": "resource",
          "start": "2023-02-10T08:00:00",
          "end": "2023-02-20T17:00:00",
          "site": "site3",
        },
        {
          "category": "enrollment",
          "start": "2023-02-27T08:00:00",
          "end": "2023-03-15T17:00:00",
          "site": "site3",
        },
      ]
    },
    {
      "site": "site4",
      "data": [
        {
          "category": "contract",
          "start": "2023-01-01T08:00:00",
          "end": "2023-01-10T17:00:00",
          "site": "site4",
        },
        {
          "category": "siv",
          "start": "2023-01-25T08:00:00",
          "end": "2023-01-30T17:00:00",
          "site": "site4",
        },
        {
          "category": "resource",
          "start": "2023-02-10T08:00:00",
          "end": "2023-02-20T17:00:00",
          "site": "site4",
        },
        {
          "category": "enrollment",
          "start": "2023-02-27T08:00:00",
          "end": "2023-03-15T17:00:00",
          "site": "site4",
        },
      ]
    },
    {
      "site": "site5",
      "data": [
        {
          "category": "contract",
          "start": "2023-03-01T08:00:00",
          "end": "2023-03-10T17:00:00",
          "site": "site5",
        },
        {
          "category": "siv",
          "start": "2023-03-01T08:00:00",
          "end": "2023-03-20T17:00:00",
          "site": "site5",
        },
        {
          "category": "resource",
          "start": "2023-03-01T08:00:00",
          "end": "2023-03-10T17:00:00",
          "site": "site5"
        },
        {
          "category": "enrollment",
          "start": "2023-03-01T08:00:00",
          "end": "2023-03-30T17:00:00",
          "site": "site5"
        }
      ]
    },
    {
      "site": "site6",
      "data": [
        {
          "category": "contract",
          "start": "2023-03-05T08:00:00",
          "end": "2023-03-15T17:00:00",
          "site": "site6"
        },
        {
          "category": "siv",
          "start": "2023-03-20T08:00:00",
          "end": "2023-03-30T17:00:00",
          "site": "site6"
        },
        {
          "category": "resource",
          "start": "2023-04-05T08:00:00",
          "end": "2023-04-15T17:00:00",
          "site": "site6"
        },
        {
          "category": "enrollment",
          "start": "2023-04-20T08:00:00",
          "end": "2023-04-25T17:00:00",
          "site": "site6"
        }
      ]
    },
    {
      "site": "site7",
      "data": [
        {
          "category": "contract",
          "start": "2023-03-10T08:00:00",
          "end": "2023-03-20T17:00:00",
          "site": "site7"
        },
        {
          "category": "siv",
          "start": "2023-03-25T08:00:00",
          "end": "2023-04-05T17:00:00",
          "site": "site7"
        },
        {
          "category": "resource",
          "start": "2023-04-10T08:00:00",
          "end": "2023-04-25T17:00:00",
          "site": "site7"
        },
        {
          "category": "enrollment",
          "start": "2023-05-01T08:00:00",
          "end": "2023-05-10T17:00:00",
          "site": "site7"
        }
      ]
    },
    {
      "site": "site8",
      "data": [
        {
          "category": "contract",
          "start": "2023-03-10T08:00:00",
          "end": "2023-03-20T17:00:00",
          "site": "site8"
        },
        {
          "category": "siv",
          "start": "2023-03-25T08:00:00",
          "end": "2023-04-05T17:00:00",
          "site": "site8"
        },
        {
          "category": "resource",
          "start": "2023-04-10T08:00:00",
          "end": "2023-04-25T17:00:00",
          "site": "site8"
        },
        {
          "category": "enrollment",
          "start": "2023-05-01T08:00:00",
          "end": "2023-05-10T17:00:00",
          "site": "site8"
        }
      ]
    },
    {
      "site": "site9",
      "data": [
        {
          "category": "contract",
          "start": "2023-03-10T08:00:00",
          "end": "2023-03-20T17:00:00",
          "site": "site9"
        },
        {
          "category": "siv",
          "start": "2023-03-25T08:00:00",
          "end": "2023-04-05T17:00:00",
          "site": "site9"
        },
        {
          "category": "resource",
          "start": "2023-04-10T08:00:00",
          "end": "2023-04-25T17:00:00",
          "site": "site9"
        },
        {
          "category": "enrollment",
          "start": "2023-05-01T08:00:00",
          "end": "2023-05-10T17:00:00",
          "site": "site9"
        }
      ]
    },
    {
      "site": "site10",
      "data": [
        {
          "category": "contract",
          "start": "2023-03-10T08:00:00",
          "end": "2023-03-20T17:00:00",
          "site": "site10"
        },
        {
          "category": "siv",
          "start": "2023-03-25T08:00:00",
          "end": "2023-04-05T17:00:00",
          "site": "site10"
        },
        {
          "category": "resource",
          "start": "2023-04-10T08:00:00",
          "end": "2023-04-25T17:00:00",
          "site": "site10"
        },
        {
          "category": "enrollment",
          "start": "2023-05-01T08:00:00",
          "end": "2023-05-10T17:00:00",
          "site": "site10"
        }
      ]
    }
  ]
  data:any[]=[];
  holidayData:any[]=[];
  output:any;
  finalGroupedData:GroupedItem[]=[];
  charts!:am4charts.XYChart;
  showLoading:boolean = true;
  
  constructor(private zone:NgZone){}

  ngAfterViewInit():void{
    window.scroll(0,0);

    this.zone.runOutsideAngular(()=>{

      am4core.useTheme(am4themes_animated);

      this.sitesData.forEach((item,idx)=>{
        this.charts = am4core.create(`chartdiv-${idx}`, am4charts.XYChart);
        this.charts.hiddenState.properties.opacity = 0;
        this.charts.logo.__disabled=true;
        this.charts.paddingTop=0;
        this.charts.paddingBottom=0;
        this.charts.dateFormatter.inputDateFormat="yyyy-MM-dd HH:mm";
  
        let colorSet=new am4core.ColorSet();
        colorSet.saturation=0.4;
        const categoryColors = {
          "contract": am4core.color("#91E1FF"),
          "siv": am4core.color("#919BFF"),
          "resource": am4core.color("#CD91FF"),
          "enrollment": am4core.color("#FF91B2")
        };
        type CategoryType = keyof typeof categoryColors;

        this.data = [];
        this.holidayData = [];
        this.output = [];
        this.finalGroupedData = [];
        // this.sitesData.forEach(siteData => {
          item.data.forEach((item: { site:any; category: CategoryType; start: string | number | Date; end: string | number | Date; }) => {
            this.data.push({
              "site":item.site,
              "category":item.category,
              "start":new Date(item.start),
              "end":new Date(item.end),
              "color": am4core.color(categoryColors[item.category])
            })
          })
        // })
        this.charts.data = this.data;
        this.chartInstance.push(this.charts);
        this.adjustHeight(idx);

        for(var i=1;i<this.data.length;i++){
          if(this.data[i-1].end.getTime() < this.data[i].start.getTime()){
            this.holidayData.push({
              "site":this.data[i-1].site,
              "category":"Holiday",
              "start":new Date(this.data[i-1].end),
              "end":new Date(this.data[i].start),
              "color":am4core.color("#808080")
            })
          }
        }

        let categoryAxis = this.charts.yAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "site";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.inversed=true;
      
        let dateAxis = this.charts.xAxes.push(new am4charts.DateAxis());
        dateAxis.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm";
        dateAxis.renderer.minGridDistance = 50;
        dateAxis.baseInterval = { count:1, timeUnit:'day' };
        dateAxis.strictMinMax = true;
        dateAxis.renderer.tooltipLocation = 0;
        dateAxis.min = new Date('2023-01-01').getTime();
        dateAxis.max = new Date('2023-05-30').getTime();

        if(this.sitesData.length-1 !== idx){
          dateAxis.renderer.labels.template.disabled = true;
        }

        this.output = this.transformData(this.data);

        this.makeSuitableData();

        this.finalGroupedData.forEach((item:{details:any[]})=>{
          this.createSeries(item.details);
        })
        if(this.holidayData.length>0){
          this.createSeriesHoliday();
        }

        this.chart = this.charts;

      })
    })
    this.showLoading = false;
  }
  
  createSeries=(data:any)=>{
    const series = this.charts.series.push(new am4charts.ColumnSeries());
    series.columns.template.width = am4core.percent(100);
    series.columns.template.tooltipText = "{category} - {start} to {end}";
    series.dataFields.openDateX = "end";
    series.dataFields.dateX = "start";
    series.dataFields.categoryY = 'site';
    series.columns.template.height = am4core.percent(100);
    series.columns.template.strokeOpacity = 0;
    series.columns.template.propertyFields.fill = "color";
    
    let labelBullet = series.columns.template.createChild(am4core.Label);
    labelBullet.text = "{category}";
    labelBullet.align = "center";
    labelBullet.valign = "middle";
    labelBullet.fill = am4core.color("#FFFFFF");
    series.data = data;
  }

  createSeriesHoliday(){
    let series = this.charts.series.push(new am4charts.ColumnSeries());
    series.data = this.holidayData;
    series.columns.template.width = am4core.percent(100);
    
    series.columns.template.tooltipText = "{category} - {start} to {end}";
    series.dataFields.openDateX = "end";
    series.dataFields.dateX = "start";
    series.dataFields.categoryY = "site";

    series.columns.template.height = am4core.percent(100);
    series.columns.template.strokeOpacity = 0;
    series.columns.template.propertyFields.fill = "color";

    let labelBullet = series.columns.template.createChild(am4core.Label);
    labelBullet.text = "{category}";
    labelBullet.align = "center";
    labelBullet.valign = "middle";
    labelBullet.fill = am4core.color("#FFFFFF");
  }

  transformData = (data: DataItem[]): any[] => {
    const result: any[] = [];
    let currentSite = '';
    let seriesCounter = 0;
    let dateArray: string[] = [];
    let flag:boolean=false;

    data.forEach(item => {
      if (item.site !== currentSite) {
        dateArray = [];
        currentSite = item.site;
        seriesCounter = 1;
      }

      let currentSeriesName = `Series ${seriesCounter}`;
      if (dateArray.some(date => new Date(date).getTime() === new Date(item.start).getTime())) {
        seriesCounter++;
        currentSeriesName = `Series ${seriesCounter}`;
        flag=false;
      } else {
        flag=true
        dateArray.push(item.start);
      }

      const resultItem = result.find(r => r.site === item.site);
      
      const transformedItem = {
        site: item.site,
        series: flag && resultItem ? resultItem.series : `${currentSeriesName}`,
        details: [
          {
            category: item.category,
            series: flag && resultItem ? resultItem.series : `${currentSeriesName}`,
            start: item.start,
            end: item.end,
            site: item.site,
            color:item.color
          }
        ]
      };

      result.push(transformedItem);
    });

    return result;
  };

  makeSuitableData(){
    const groupedData: { [site: string]: { [series: string]: { details: Detail[] } } } = {};

    this.output.forEach((item: { site: any; series: any; details: any; }) => {
      const { site, series, details } = item;
      const detail = details[0]; 
  
      if (!groupedData[site]) {
          groupedData[site] = {};
      }
  
      if (!groupedData[site][series]) {
          groupedData[site][series] = { details: [] };
      }
  
      groupedData[site][series].details.push(detail);
  });


    for (const site in groupedData) {
      for (const series in groupedData[site]) {
        this.finalGroupedData.push({
          site,
          series,
          details: groupedData[site][series].details,
        });
      }
    }
  }

  adjustHeight(idx:number){
    const chartDiv = document.getElementById(`chartdiv-${idx}`);
    if (chartDiv) {
      const dataLength = this.charts.data ? this.charts.data.length : 0;
      const calculatedHeight = dataLength * 40;
      chartDiv.style.height = `${calculatedHeight}px`;
    }
  }

  ngOnDestroy(){
    this.zone.runOutsideAngular(()=>{
      if(this.chart){
        this.chart.dispose();
      }
    })
  }
}
