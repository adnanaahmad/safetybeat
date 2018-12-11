import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';

const authRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'forgotPassword', component: ForgotPasswordComponent
  },
  {
    path: 'signup', component: RegistrationComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
