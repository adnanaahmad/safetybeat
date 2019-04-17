import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'entityControl',
      pathMatch: 'full'
    },
    {
      path: 'entityControl',
      loadChildren: './modules/entityControl/entityControl.module#EntityControlModule',
    },
    {
      path: 'siteCenter',
      loadChildren: './modules/siteCenter/siteCenter.module#SiteCenterModule'
    },
    {
      path: 'hazardCenter',
      loadChildren: './modules/hazardCenter/hazardCenter.module#HazardCenterModule'
    },
    {
      path: 'memberCenter',
      loadChildren: './modules/memberCenter/memberCenter.module#MemberCenterModule'
    },
    {
      path: 'permissionCenter',
      loadChildren: './modules/permissionCenter/permissionCenter.module#PermissionCenterModule'
    },
    {
      path: 'questionCenter',
      loadChildren: './modules/questionCenter/questionCenter.module#QuestionCenterModule'
    }
  ]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminControlRoutingModule {


}
