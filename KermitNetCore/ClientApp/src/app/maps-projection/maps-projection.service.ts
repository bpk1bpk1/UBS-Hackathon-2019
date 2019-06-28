import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { data as totalCarbonByCountry}  from './total-country-carbon'
import { data as worldMap } from './world-map'
import { data as currentCountryCarbon } from './current-country-carbon'
import { Subject } from 'rxjs';
import { isArray } from 'util';
@Injectable({
  providedIn: 'root'
})
export class MapsProjectionService {

  // Observable string sources
  private baselineAnnouncedSource = new Subject<any>();
  private baselineConfirmedSource = new Subject<any>();

  // Observable string streams
  baselineAnnounced$ = this.baselineAnnouncedSource.asObservable();
  baselineConfirmed$ = this.baselineConfirmedSource.asObservable();

  // Service message commands
  announceBaseline(baseline: any) {
    console.log('announceBaseline', baseline);
    this.baselineAnnouncedSource.next(baseline);
  }

  confirmBaseline(baseline: any) {
    this.baselineConfirmedSource.next(baseline);
  }


  getYears(): string[] {
    let years = [];
    for (var i = 2019; i <= 2029; years.push(i++));
    return years;
  }

  getCountries(): string[] {
    return currentCountryCarbon.map(item => item.country);
  }

  getTopCountries(country: string,top:number): string[] {
    var data = currentCountryCarbon.filter(a => a.country !== country).sort((a, b) => b.yearCarbonEmissions['2018'] - a.yearCarbonEmissions['2018']);
    data = data.splice(1, top - 1);
    var rows = currentCountryCarbon.filter(a => a.country === country);
    if (isArray(rows) && (rows.length > 0)) {
      data.splice(0,0,rows[0]);
    }
    return data.map(item => item.country);
  }

  getTotalCarbonByCountry(year: number): any {
    if (year === null) {
      year = (new Date()).getFullYear()-1;
    }

    var data = currentCountryCarbon.map(t => {
      return { 'country': t.country, 'value': t.yearCarbonEmissions[year] };
    });
    return data;
  }

  getPortfolio(portfolio: any): any {
    var data = currentCountryCarbon.map(t => {
      return { 'country': t.country, 'value': t.yearCarbonEmissions[2018] };
    });
    return data;
  }

  getBaseline(country:string): any {
    var data = currentCountryCarbon.sort((a, b) => a.yearCarbonEmissions[2018] - b.yearCarbonEmissions[2018]);
    this.announceBaseline({country:country,data:data});
  }

  getCurrentCountryCarbon(): any {
    return currentCountryCarbon;
  }

  getWorldMap(): any {
    return worldMap;
  }
  getColorForCountries(): any {
    return [{
      from: 0, to: 5, color: '#AFD100', label: '<5'
    }, {
      from: 5, to: 10, color: '#CFC700', label: '5-10'
    }, {
      from: 10, to: 15, color: '#CEB100', label: '10-15'
    },
    {
      from: 15, to: 20, color: '#CA7100', label: '15-20'
    },
    {
      from: 20, to: 40, color: '#C63300', label: '20-40'
    },
    {
      from: 40, to: 100, color: '#C20007', label: '40-100'
    }
    ];
  }
  constructor(private http: HttpClient) { }
}
