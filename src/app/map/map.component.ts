import { Component, OnInit } from '@angular/core';
import { GmMapConfig } from '../common/ng-gmap/model/mapconfig.model';

@Component({
    templateUrl: 'map.tpl.html',
})
export class MapComponent implements OnInit {
    public mapConfig: GmMapConfig;

    public ngOnInit(): void {
        this.mapConfig = new GmMapConfig(
            18.5204,
            73.8567, 8);
    }
}
