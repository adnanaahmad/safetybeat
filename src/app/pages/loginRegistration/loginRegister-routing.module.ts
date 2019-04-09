import {NgModule} from '@angular/core';
import {
  Routes,
  RouterModule,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {VerificationComponent} from './components/verification/verification.component';
import {ForgotPasswordComponent} from './components/forgotPassword/forgotPassword.component';
import {LandingComponent} from './components/landing/landing.component';
import {PasswordRecoveryComponent} from './components/passwordRecovery/passwordRecovery.component';

const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
  {
    path: 'landing',
    component: LandingComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent
  },
  {
    path: 'passwordRecovery/:uid/:token',
    component: PasswordRecoveryComponent
  }, {
    path: 'signup',
    component: RegistrationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
  providers: [
    {
      provide: 'canDeactivateVerification',
      useValue: (
        component: VerificationComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
      ) => {
        return false;
      }
    }
  ]
})
export class LoginRegisterRoutingModule {
}
