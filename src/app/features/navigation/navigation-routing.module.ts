import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NavigationComponent} from './components/navigation/navigation.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {path: '', redirectTo: 'adminControl', pathMatch: 'full'},
      {
        path: 'profile',
        loadChildren: '../profile/profile.module#ProfileModule'
      },
      {
        path: 'settings',
        loadChildren: '../settings/settings.module#SettingsModule'
      },
      {
        path: 'adminControl',
        loadChildren: '../adminControl/adminControl.module#AdminControlModule'
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule {
}
