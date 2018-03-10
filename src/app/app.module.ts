import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { AboutUsComponent } from './about/about.component';
import { AppRouteModule } from './app-route.module';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { Http404Component } from './common/404/http404.component';
import { LoginComponent } from './common/login/login.component';
import { NavigationComponent } from './common/navigation/navigation.component';
import { ContactUsComponent } from './contactus/contactus.component';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { WeatherService } from './weather/weather.service';
import { CommonModule } from './common/common.module';

@NgModule({
    imports: [
        HttpModule,
        BrowserModule,
        AppRouteModule,
        FormsModule,
        CommonModule,
    ],
    declarations: [
        AppComponent, LoginComponent, AboutUsComponent, ContactUsComponent,
        Http404Component, NavigationComponent, HomeComponent, MapComponent,
    ],
    providers: [AppService, WeatherService],
    bootstrap: [AppComponent],
})
export class AppModule { }
