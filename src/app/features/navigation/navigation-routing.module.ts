import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NavigationComponent} from './components/navigation/navigation.component';
import { NoAuthGuard } from 'src/app/services/core/restrict/restrict.service';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {
        path: '',
        redirectTo: 'adminControl',
        pathMatch: 'full'
      },
      {
        path: 'profile',
        loadChildren: '../profile/profile.module#ProfileModule',
        canActivate: [NoAuthGuard]
      },
      {
        path: 'settings',
        loadChildren: '../settings/settings.module#SettingsModule',
        canActivate: [NoAuthGuard]
      },
      {
        path: 'adminControl',
        loadChildren: '../adminControl/adminControl.module#AdminControlModule',
        canActivate: [NoAuthGuard]
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  // providers: [NoAuthGuard]
})
export class NavigationRoutingModule {
}
