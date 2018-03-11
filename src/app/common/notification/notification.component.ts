import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy, Input } from '@angular/core';
import { NotificationAlertService } from './service/notificationAlert.service';
import { Alert } from './model/alert.model';

@Component({
    selector: 'notification',
    templateUrl: 'notification.tpl.html',
    styleUrls: ['./notification.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationComponent implements OnInit, OnDestroy {
    private notificationService: NotificationAlertService;
    private msg: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ' +
        'Etiam accumsan apibus enim, at sodales ex. Ut vehicula Mauris eu lorem nunc.' +
        ' Donec ex felis, rhoncus sit amet lectus at, rhoncus interdum elit. Maecenas at tempus elit.' +
        '<a href="github.com">GitHub</a>';
    @Input() private alert: Alert = new Alert(1, this.msg, '', true, true);

    public constructor(notificationService: NotificationAlertService) {
        this.notificationService = notificationService;
    }

    public ngOnDestroy(): void {
        console.log('error');
    }
    public ngOnInit(): void {
        console.log('error');
    }

    /**
     * Close button click event handler
     * @param  mouse event
     */
    public onCloseBtnClick($e: MouseEvent): void {
        alert('Close button click' + $e);
        this.alert.active = false;
    }
}
