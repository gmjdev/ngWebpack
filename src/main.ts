import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
const platform = platformBrowserDynamic();

// Enable production mode
if (process.env.ENV === 'production' || process.env.NODE_ENV === 'production') {
    // tslint:disable-next-line:no-console
    console.log('Production mode is on');
    enableProdMode();
}
platform.bootstrapModule(AppModule);
