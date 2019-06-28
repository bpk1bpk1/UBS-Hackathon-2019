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
  product = new FormControl();
  currentData = [];
  selectedYear = (new Date()).getFullYear() - 1;
  maxYear = this.selectedYear;
  minYear = this.maxYear-50;
  year = new FormControl();
  dataSource = [];
  shapeData = [];
  shapeSettings = {
    colorMapping: {},
    fill: '',
    colorValuePath:''
  };
  isVisible = true;
  // custom code start
  public load = (args: ILoadEventArgs) => {
    let theme: string = location.hash.split('/')[1];
    theme = theme ? theme : 'Material';
    args.maps.theme = <MapsTheme>(theme.charAt(0).toUpperCase() + theme.slice(1));
    this.maps = args.maps;
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

  private getSelectedYear= () => this.selectedYear;

  titleSettings={
    text: this.selectedYear.toString(),
    textStyle: {
      size: '12px'
    }
  };

  public changeSelectedYear = (args) => {
    this.selectedYear = args.value;
    this.dataSource = this.mapsProjectionService.getTotalCarbonByCountry(this.selectedYear);
    this.titleSettings.text = this.selectedYear.toString();
    this.shapeSettings = {
      fill: '#E5E5E5',
      colorMapping: this.mapsProjectionService.getColorForCountries(),
      colorValuePath: 'value'
    };
    this.maps.refresh();
  }

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

  public layer =     {
      shapeData: this.mapsProjectionService.getWorldMap(),
      shapeDataPath: 'country',
      shapePropertyPath: 'name',
      dataSource: this.dataSource,
      tooltipSettings: {
        visible: true,
        valuePath: 'value',
        format: 'Country: ${country} <br> Carbon: ${value}'
      },
    }  ;
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
    this.dataSource = this.mapsProjectionService.getTotalCarbonByCountry(this.selectedYear);
    this.shapeSettings = {
      fill: '#E5E5E5',
      colorMapping: this.mapsProjectionService.getColorForCountries(),
      colorValuePath: 'value'
    };
    console.log('maps', this.maps);
  }

}
