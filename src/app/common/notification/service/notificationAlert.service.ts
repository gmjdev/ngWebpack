import { Injectable } from '@angular/core';
import { Alert } from '../model/alert.model';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class NotificationAlertService {
    private alerts: Alert[];

    public addAlert(alert: Alert) {
        this.alerts.push(alert);
    }
}
