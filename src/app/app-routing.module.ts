import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/auth/auth.module#AuthModule',
  },
  {
    path: 'dashboard',
    loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
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
        enableTracing: false,// <-- debugging purposes only
      }
    )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
