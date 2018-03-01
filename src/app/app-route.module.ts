import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './common/login/login.component';
import { Http404Component } from './common/404/http404.component';
import { AboutUsComponent } from './about/about.component';
import { ContactUsComponent } from './contactus/contactus.component';
import { NavigationComponent } from './common/navigation/navigation.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
    { path: 'aboutus', component: AboutUsComponent },
    { path: 'home', component: HomeComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'contactus', component: ContactUsComponent },
    { path: '**', component: Http404Component },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
})
export class AppRouteModule { }
