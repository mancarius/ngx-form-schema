import 'zone.js/dist/zone';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app.component';
import { provideRouter } from '@angular/router';
import { APP_ROUTES } from './app/app.routing';

bootstrapApplication(App, {
  providers: [
    provideRouter(APP_ROUTES)
  ]
});
