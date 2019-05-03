import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/guards/auth.guard';
export const routes: Routes = [
  {
    path: '',
    loadChildren: 'src/app/pages/loginRegistration/loginRegister.module#LoginRegisterModule',
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: 'src/app/pages/navigation/navigation.module#NavigationModule'
  },
  {
    path: 'welcomeScreen',
    canActivate: [AuthGuard],
    loadChildren: 'src/app/pages/welcomeScreen/welcomeScreen.module#WelcomeScreenModule'
  },
  {
    path: '**',
    loadChildren: 'src/app/core/core.module#CoreModule'
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
