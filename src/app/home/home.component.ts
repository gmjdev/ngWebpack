import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather/weather.service';
import { Weather } from '../weather/model/weather.model';

@Component({
    templateUrl: 'home.tpl.html',
    styleUrls: ['home.css', 'home.scss'],
})
export class HomeComponent implements OnInit {
    private errorMessage: string;
    private weathers: Weather[];
    private weatherDataAvailable: boolean = false;
    private model = new Weather(0, 'Pune', '', 0, 0, 0, 0, 0);

    constructor(private weatherService: WeatherService) { }

    public ngOnInit() {
        /**
         * purpose
         */
    }

    public getWeatherInfo() {
        this.weatherService.getWeatherInformation(this.model.name).subscribe(
            (weathers) => {
                this.weathers = weathers;
                this.weatherDataAvailable = true;
            },
            (error) => this.errorMessage = error as any,
        );
    }
}
