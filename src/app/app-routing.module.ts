import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/services/guards/auth.guard';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';
export const routes: Routes = [
  {
    path: '',
    loadChildren: 'src/app/pages/login-Registration/login-register.module#LoginRegisterModule',
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadChildren: 'src/app/pages/navigation/navigation.module#NavigationModule'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false, // <-- debugging purposes only
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
