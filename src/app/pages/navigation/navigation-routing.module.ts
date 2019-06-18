import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NavigationComponent} from './components/navigation/navigation.component';
import {DocumentsComponent} from './components/documents/documents.component';
import {ShowDocumentsComponent} from './components/showDocuments/showDocuments.component';

const routes: Routes = [
  {
    path: '',
    component: NavigationComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadChildren: '../dashboard/dashboard.module#DashboardModule',
      },
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
      },
      {
        path: 'analyticsReport',
        loadChildren: '../analyticsReport/analyticsReport.module#AnalyticsReportModule'
      },
      {
        path: 'documents',
        component: DocumentsComponent
      },
      {
        path: 'viewDocs',
        component: ShowDocumentsComponent
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NavigationRoutingModule {
}
