import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Weather } from './model/weather.model';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class WeatherService {
    private weatherApiUrl = 'http://api.openweathermap.org/data/2.5/weather?';
    private weatherQuery = 'q=';
    private weatherQueryUnits = '&units=imperial&appid=4cb4bc7bedcb5629388b9c196956d55e';

    constructor(private http: Http) { }

    public getWeatherInformation(city: string): Observable<Weather[]> {
        if (!city) {
            city = 'Pune,in';
        }
        const url = this.weatherApiUrl + this.weatherQuery + city + this.weatherQueryUnits;
        return this.http.get(url).map(this.extractWeatherDetails).
            catch(this.handleError);
    }

    private extractWeatherDetails(res: Response) {
        const body = res.json();
        const weathers: Weather[] = [];
        let data = body || {};
        if (body.data) {
            data = body.data;
        }
        if (data && data.length > 0) {
            console.log('data' + data);
        } else {
            weathers.push(new Weather(data.id, data.name, data.cod,
                data.main.humidity,
                data.main.pressure,
                data.main.temp,
                data.main.temp_max,
                data.main.temp_min));
        }
        return weathers;
    }

    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}
