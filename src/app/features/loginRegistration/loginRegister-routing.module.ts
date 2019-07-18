import {NgModule} from '@angular/core';
import {Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot,} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {ForgotPasswordComponent} from './components/forgotPassword/forgotPassword.component';
import {PasswordRecoveryComponent} from './components/passwordRecovery/passwordRecovery.component';
import {PackageDetailsComponent} from './components/packageDetails/packageDetails.component';
import {AuthGuard} from '../../services/core/guards/auth.guard';

const authRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
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
    component: PackageDetailsComponent,
    canActivate: [AuthGuard],
    canDeactivate: ['canDeactivatePackageDetails']
  }
];

@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule],
  providers: [
    {
      provide: 'canDeactivatePackageDetails',
      useValue: (
        component: PackageDetailsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState: RouterStateSnapshot
      ) => {
        return (nextState.url === '/login');
      }
    }
  ]
})
export class LoginRegisterRoutingModule {
}
