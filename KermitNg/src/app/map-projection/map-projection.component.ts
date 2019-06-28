import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-map-projection',
  templateUrl: './map-projection.component.html',
  styleUrls: ['./map-projection.component.css']
})
export class MapProjectionComponent implements OnInit {
  private _data = [];

  @Input()
  set data(data: any[]) {
    this._data = data;
  }

  get data(): any[] { return this._data; }
  constructor() { }

  ngOnInit() {
    console.log('data', this.data);
  }

}
