import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NotificationComponent } from './notification/notification.component';
import { NotificationAlertService } from './notification/service/notificationAlert.service';
import { GmMapComponent } from './ng-gmap/gm-map.component';
import { GmMapService } from './ng-gmap/service/gm-map.service';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        NotificationComponent, GmMapComponent,
    ],
    providers: [NotificationAlertService, GmMapService],
    exports: [
        NotificationComponent,
        GmMapComponent,
    ],
})
export class CommonModule { }
