import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NotificationComponent } from './notification/notification.component';
import { NotificationAlertService } from './notification/service/notificationAlert.service';

@NgModule({
    imports: [
        BrowserModule,
    ],
    declarations: [
        NotificationComponent,
    ],
    providers: [NotificationAlertService],
    exports: [
        NotificationComponent,
    ],
})
export class CommonModule { }
