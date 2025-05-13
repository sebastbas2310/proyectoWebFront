import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './side-login/side-login.component';
//import { AppSideRegisterComponent } from './side-register/side-register.component';

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component: AppSideLoginComponent,
      }
    ],
  },
];
