import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerificationComponent } from './components/verification/verification.component';
import { AuthGuard } from 'src/app/core/services/guards/auth.guard';



const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgotPassword', component: ForgotPasswordComponent
  },
  {
    path: 'signup', component: RegistrationComponent,
  },
  {
    path: 'verification',
    component: VerificationComponent,
    canActivate: [AuthGuard],
    canDeactivate: [true]
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
export class LoginRegisterRoutingModule { }
