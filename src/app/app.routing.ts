import { Routes } from "@angular/router";

export const APP_ROUTES: Routes = [
  {
    path: 'examples',
    children: [
      {
        path: 'form-control-schema',
        loadComponent: () =>
          import('./modules/examples/single-control-example/single-control-example.component')
            .then(m => m.SingleControlExampleComponent)
      }
    ]
  }
];
