import { DebugElement, Component, Renderer, NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
    TestBed, async, ComponentFixture, inject,
    ComponentFixtureAutoDetect
} from '@angular/core/testing';
import { Router, RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavigationComponent } from './common/navigation/navigation.component';
import { APP_BASE_HREF } from '@angular/common';
import { AppRouteModule } from './app-route.module';
import { LoginComponent } from './common/login/login.component';
import { Http404Component } from './common/404/http404.component';
import { AboutUsComponent } from './about/about.component';
import { AppModule } from './app.module';
import { ContactUsComponent } from './contactus/contactus.component';
import { HomeComponent } from './home/home.component';
import { RouterLinkStubDirective, RouterOutletStubComponent } from '../testing/router.stubs';

let routerStub;
let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let links, linkDes;

describe('AppComponent Test', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, RouterTestingModule]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(AppComponent);
            comp = fixture.componentInstance;
        });
    }));

    beforeEach(() => {
        // trigger initial data binding
        fixture.detectChanges();
        linkDes = fixture.debugElement
            .queryAll(By.directive(RouterLinkWithHref));

        // get the attached link directive instances using the DebugElement injectors
        links = linkDes
            .map(de => de.injector.get(RouterLinkWithHref) as RouterLinkWithHref);
    });

    it('should verify router links', () => {
        expect(links.length).toBe(3, 'should have 3 links');
        expect(links[0].href).toBe('/home', '1st link should go to Home');
        expect(links[2].href).toBe('/aboutus', '2nd link should go to About Us');
        expect(links[1].href).toBe('/contactus', '3rd link should go to Contact Us');
    });

});