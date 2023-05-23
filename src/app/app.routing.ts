import { Routes } from "@angular/router";

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'examples',
    pathMatch: 'full'
  },
  {
    path: 'examples',
    children: [
      {
        path: 'form-control-schema',
        loadComponent: () =>
          import('./modules/examples/single-control-example/single-control-example.component')
            .then(m => m.SingleControlExampleComponent)
      },
      {
        path: 'form-group-schema',
        loadComponent: () =>
          import('./modules/examples/group-from-json-example/group-from-json-example.component')
            .then(m => m.GroupFromJsonExampleComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'examples',
  },
];
