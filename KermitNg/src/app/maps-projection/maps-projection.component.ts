import { Component, ViewEncapsulation, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MapsTheme, Maps, Zoom, Legend, ProjectionType, MapsTooltip, ILoadEventArgs, ITooltipRenderEventArgs } from '@syncfusion/ej2-angular-maps';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { MapsProjectionService } from './maps-projection.service';
import { FormControl } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';


Maps.Inject(Zoom, Legend, MapsTooltip);
@Component({
  selector: 'control-content',
  templateUrl: './maps-projection.component.html',
  styleUrls:['./maps-projection.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class MapsProjectionComponent implements OnInit, OnDestroy{
    ngOnDestroy(): void {
        throw new Error("Method not implemented.");
    }
  @ViewChild('maps', { static: true })
  public maps: Maps;
  worldMap = [];
  carbonByCountry = [];
  colorsByCountry = [];
  countries = [];
  products = [];
  years = new Array<number>();
  country = new FormControl();
  investmentValue = new FormControl();
  portfolio = [];
  product= new FormControl();
year= new FormControl();
  // custom code start
  public load = (args: ILoadEventArgs) => {
    let theme: string = location.hash.split('/')[1];
    theme = theme ? theme : 'Material';
    args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
  }
  // custom code end
  public zoomSettings: object = {
    enable: false
  };

  public legendSettings: Object = {
    position: 'Bottom',
    width: '400px',
    visible: true,
    mode: "Interactive"
  };

  public tooltipRender = (args: ITooltipRenderEventArgs) => {
    if (!args.options['data']) {
      args.cancel = true;
    }
  };
  public calculate = (): void => {
    if (this.portfolio.length===0) {
      this.notificationsService.error("Please create a portfolio");
      return;
    }
  }
  public add = (): void => {
    if ((this.product.value || '') === '') {
      this.notificationsService.error("Please select a product");
      return;
    }
    if ((this.year.value || '') === '') {
      this.notificationsService.error("Please select a year");
      return;
    }
    if ((this.investmentValue.value || '') === '') {
      this.notificationsService.error("Please select an investment value");
      return;
    }
    this.portfolio.push({ product: this.product.value, year: this.year.value, investmentValue: this.investmentValue.value });
    this.product.setValue('');
    this.year.setValue('');
    this.investmentValue.setValue('');
  }

  public remove = (i: number): void => {
    if (i < this.portfolio.length) {
      this.portfolio.splice(i, 1);
    }
  }

  public layers: object[] = [
    {
      shapeData: this.mapsProjectionService.getWorldMap(),
      shapeDataPath: 'Country',
      shapePropertyPath: 'name',
      dataSource: this.mapsProjectionService.getCarbonByCountry(),
      tooltipSettings: {
        visible: true,
        valuePath: '2014',
        format: 'Country: ${Country} <br> Carbon: ${2014}'
      },
      shapeSettings: {
        fill: '#E5E5E5',
        colorMapping: this.mapsProjectionService.getColorForCountries(),
        colorValuePath: '2014'
      }
    }
  ];
  ngAfterViewInit() {
    let projection: DropDownList = new DropDownList({
      index: 0, placeholder: 'Select projection type', width: 120,
      change: () => {
        this.maps.projectionType = <ProjectionType>projection.value;
        this.maps.refresh();
      }
    });
    projection.appendTo('#projectiontype');
  }
  constructor(private mapsProjectionService: MapsProjectionService, private notificationsService: NotificationsService) {
  };
  ngOnInit(): void {
    this.countries = this.mapsProjectionService.getCountries();
    var year = (new Date()).getFullYear();
    for (var i = 0; i < 50; this.years.push(year + (i++)));
    for (var i = 0; i < 5; this.products.push('product' + (i++)));
  }

}
