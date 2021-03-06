import { Component, OnInit,  ViewChild, Input } from '@angular/core';
import { MapsProjectionService } from '../maps-projection/maps-projection.service';
import { HeatMap, Legend, Tooltip, Adaptor, ILoadedEventArgs, HeatMapTheme } from '@syncfusion/ej2-angular-heatmap';
import { combineLatest } from 'rxjs'
HeatMap.Inject(Tooltip, Legend, Adaptor);

@Component({
  selector: 'app-map-projection',
  templateUrl: './map-projection.component.html',
  styleUrls: ['./map-projection.component.css']
})
export class MapProjectionComponent implements OnInit {
  @ViewChild('heatmap', { static: true })
  public heatmap: HeatMap;
  dataSource = [[]];
  constructor(private mapsProjectionService: MapsProjectionService,) { }

  xAxis: Object = {
    labels: [""],
    labelRotation: 45,
    labelIntersectAction: 'None',
  };

  yAxis: Object = {
    labels: [""]
  };


  public paletteSettings: Object = {
    palette: [
      { value: 5, color: '#AFD100' },
      { value: 10, color: '#CFC700' },
      { value: 15, color: '#CEB100' },
      { value: 16, color: '#CA7100' },
      { value: 17, color: '#C63300' },
      { value: 20, color: '#C20007' }
    ],
    type: 'Fixed'
  };
  public cellSettings: Object = {
    border: { width: 0 },
    showLabel: false
  };
  public legendSettings: Object = {
    position: 'right',
    height: '400px',
    enableSmartLegend: true
  };
  public load(args: ILoadedEventArgs): void {
    let selectedTheme= 'Material';
    args.heatmap.theme = <HeatMapTheme>(selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1));
    this.heatmap = args.heatmap;
  };



  ngOnInit() {

    combineLatest([this.mapsProjectionService.baselineAnnounced$, this.mapsProjectionService.investedAnnounced$]).subscribe(all => {
      let data = all[0];
      let invested = all[1];
      console.log('data', data);
      console.log('invested', invested);
      this.heatmap.xAxis.labels = this.mapsProjectionService.getYears();
      this.heatmap.paletteSettings.type = 'Gradient';
      //this.heatmap.paletteSettings.palette = this.mapsProjectionService.getColorForCountries();
      let top = this.mapsProjectionService.getTopCountries(data.country, 1)
      var d = data.data.filter(t => top.includes(t.country));
      var inv = invested.data.filter(t => top.includes(t.country));
      this.heatmap.yAxis.labels = ['no investments',' ','with investments'];
      console.log('xaxis', this.heatmap.xAxis.labels);
      console.log('labels', this.heatmap.yAxis.labels);
      let rows = [];
      for (var j = 0; j < this.heatmap.xAxis.labels.length; j++) {
        let row = [];
        let item = d[0].yearCarbonEmissions[(parseInt(this.heatmap.xAxis.labels[j]))];
        row.push(item);
        row.push(null);
        row.push(inv[0].yearCarbonEmissions[(parseInt(this.heatmap.xAxis.labels[j]))]);
        rows.push(row);
      }
      console.log('rows', rows);
      this.heatmap.dataSource = rows;
      this.heatmap.refresh();
      console.log('baselineAnnounced$', data.data);
    })
  }
  changeLog: string[] = [];

}
