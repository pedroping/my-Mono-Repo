import { Routes } from '@angular/router';

export const HOME_ROUTES = [
  {
    path: '',
    loadComponent: async () =>
      (await import('../home/welcome-page/welcome-page.component'))
        .WelcomePageComponent,

    children: [
      {
        path: 'home',
        loadComponent: async () =>
          (await import('../home/home-page/home-page.component'))
            .HomePageComponent,
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
] as Routes;
