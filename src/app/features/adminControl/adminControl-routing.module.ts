import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {NoAuthGuard} from 'src/app/services/core/restrict/restrict.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadChildren: './modules/dashboard/dashboard.module#DashboardModule',
  },
  {
    path: 'entityControl',
    loadChildren: './modules/entityControl/entityControl.module#EntityControlModule',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'manageLeaves',
    loadChildren: './modules/manageLeave/manageLeave.module#ManageLeaveModule',
  },
  {
    path: 'siteCenter',
    loadChildren: './modules/siteCenter/siteCenter.module#SiteCenterModule',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'hazardCenter',
    loadChildren: './modules/hazardCenter/hazardCenter.module#HazardCenterModule',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'memberCenter',
    loadChildren: './modules/memberCenter/memberCenter.module#MemberCenterModule',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'permissionCenter',
    loadChildren: './modules/permissionCenter/permissionCenter.module#PermissionCenterModule',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'questionCenter',
    loadChildren: './modules/questionCenter/questionCenter.module#QuestionCenterModule',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'documents',
    loadChildren: './modules/documents/documents.module#DocumentsModule',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'myTeam',
    loadChildren: './modules/myTeam/myTeam.module#MyTeamModule',
    canActivate: [NoAuthGuard]
  },
  {
    path: 'analyticsReport',
    loadChildren: './modules/analyticsReport/analyticsReport.module#AnalyticsReportModule',
    canActivate: [NoAuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [NoAuthGuard]
})
export class AdminControlRoutingModule {


}
