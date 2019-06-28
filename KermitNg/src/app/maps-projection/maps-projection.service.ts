import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { data as totalCarbonByCountry}  from './total-country-carbon'
import { data as worldMap } from './world-map'
import { data as currentCountryCarbon } from './current-country-carbon'
@Injectable({
  providedIn: 'root'
})
export class MapsProjectionService {
  getCountries(): string[] {
    return currentCountryCarbon.map(item => item.country);
  }
  getTotalCarbonByCountry(year: number): any {
    if (year === null) {
      year = (new Date()).getFullYear()-1;
    }
    var data = currentCountryCarbon.map(t => {
      return { 'country': t.country, 'value': t.yearCarbonEmissions[year] };
    });
    console.log('data',data);
    return data;
  }

  getCurrentCountryCarbon(): any {
    return currentCountryCarbon;
  }

  getWorldMap(): any {
    return worldMap;
  }
  getColorForCountries(): any {
    return [{
      from: 0, to: 5, color: '#AFD100', label: '<10'
    }, {
      from: 5, to: 10, color: '#CFC700', label: '10-20'
    }, {
      from: 10, to: 15, color: '#CEB100', label: '20-30'
    },
    {
      from: 15, to: 20, color: '#CA7100', label: '15-20'
    },
    {
      from: 20, to: 40, color: '#C63300', label: '40-60'
    },
    {
      from: 40, to: 100, color: '#C20007', label: '60-100'
    }
    ];
  }
  constructor(private http: HttpClient) { }
}
