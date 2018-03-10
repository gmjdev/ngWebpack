import {
    Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectionStrategy,
    Input, ElementRef,
} from '@angular/core';
import { GmMapService } from './service/gm-map.service';
import { GmMap } from './model/map.model';
import { GmMapConfig } from './model/mapconfig.model';

@Component({
    selector: 'gm-map',
    templateUrl: 'gm-map.tpl.html',
    styleUrls: ['gm-map.scss', 'gm-map.css'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GmMapComponent implements OnInit, OnDestroy {
    @Input() public mapConfig: GmMapConfig;
    private google: any;

    constructor(private elem: ElementRef, private mapService: GmMapService) { }

    public ngOnDestroy(): void {
        console.log('error');
    }
    public ngOnInit(): void {
        console.log(this.mapConfig);
        const mapContainer = this.elem.nativeElement.querySelector('#map');
        const map = new google.maps.Map(mapContainer, {
            zoom: this.mapConfig.zoom,
            center: new google.maps.LatLng(this.mapConfig.lat, this.mapConfig.lng),
        });
        console.log('error');
    }
}
