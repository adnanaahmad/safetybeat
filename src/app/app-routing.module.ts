import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/core/guards/auth.guard';
import {PageNotFoundComponent} from './shared/components/pageNotFound/pageNotFound.component';
export const routes: Routes = [
  {
    path: '',
    loadChildren: 'src/app/features/loginRegistration/loginRegister.module#LoginRegisterModule',
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: 'src/app/features/navigation/navigation.module#NavigationModule'
  },
  {
    path: 'welcomeScreen',
    canActivate: [AuthGuard],
    loadChildren: 'src/app/features/welcomeScreen/welcomeScreen.module#WelcomeScreenModule'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false,
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
