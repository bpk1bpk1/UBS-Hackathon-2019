import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { data as carbonByCountry}  from './country-carbon'
import { data as worldMap } from './world-map'
@Injectable({
  providedIn: 'root'
})
export class MapsProjectionService {
  getCountries(): string[] {
    console.log(carbonByCountry.map(item => item.Country));
    return carbonByCountry.map(item => item.Country);
  }
  getCarbonByCountry(): any {
    return carbonByCountry;
  }
  getWorldMap(): any {
    return worldMap;
  }
  getColorForCountries(): any {
    return [{
      from: 0, to: 1000, color: '#AFD100', label: '<1k'
    },
    { from: 1000, to: 2000, color: '#C3D000', label: '1k-2k' }, {
      from: 2000, to: 3000, color: '#CFC700', label: '2k-3k'
    }, {
      from: 3000, to: 4000, color: '#CEB100', label: '3k-4k'
    },
    {
      from: 4000, to: 6000, color: '#CEB100', label: '4k-6k'
    },
    {
      from: 6000, to: 9000, color: '#CA7100', label: '6k-9k'
    },
    {
      from: 9000, to: 12000, color: '#C63300', label: '9k-12k'
    },
    {
      from: 10000, to: 100000, color: '#C20007', label: '12k-20k'
    }
    ];
  }
  constructor(private http: HttpClient) { }
}
