import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AuthGuard } from './core/guards/auth.guard';
const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/auth/auth.module#AuthModule',
  },
  {
    path: 'home',
    // canActivate: [AuthGuard],
    loadChildren: './pages/navigation/navigation.module#NavigationModule'
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
