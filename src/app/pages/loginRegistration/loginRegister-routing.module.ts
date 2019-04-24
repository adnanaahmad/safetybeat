import {NgModule} from '@angular/core';
import {
  Routes,
  RouterModule,
} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {ForgotPasswordComponent} from './components/forgotPassword/forgotPassword.component';
import {LandingComponent} from './components/landing/landing.component';
import {PasswordRecoveryComponent} from './components/passwordRecovery/passwordRecovery.component';
import {PackageDetailsComponent} from './components/packageDetails/packageDetails.component';

const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    path: 'signup/:email',
    component: RegistrationComponent
  },
  {
    path: 'package',
    component: PackageDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
  providers: [
    // {
    //   provide: 'canDeactivateVerification',
    //   useValue: (
    //     component: VerificationComponent,
    //     currentRoute: ActivatedRouteSnapshot,
    //     currentState: RouterStateSnapshot,
    //     nextState: RouterStateSnapshot
    //   ) => {
    //     return false;
    //   }
    // }
  ]
})
export class LoginRegisterRoutingModule {
}
