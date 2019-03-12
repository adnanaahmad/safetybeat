import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntityControlComponent } from './components/entityControl/entityControl.component';
import { HazardCenterComponent } from './components/hazardCenter/hazardCenter.component';
import { MemberCenterComponent } from './components/memberCenter/memberCenter.component';
import { PermissionCenterComponent } from './components/permissionCenter/permissionCenter.component';
import { QuestionCenterComponent } from './components/questionCenter/questionCenter.component';
import { SiteCenterComponent } from './components/siteCenter/siteCenter.component';
import { InviteUsersModalComponent } from './components/inviteUsersModal/inviteUsersModal.component';

const routes: Routes = [
  {
    path: 'entityControl',
    component: EntityControlComponent,
  },
  {
    path: 'hazardCenter',
    component: HazardCenterComponent,
  },
  {
    path: 'memberCenter',
    component: MemberCenterComponent,
  },
  {
    path: 'permissionCenter',
    component: PermissionCenterComponent,
  },
  {
    path: 'questionCenter',
    component: QuestionCenterComponent,
  },
  {
    path: 'siteCenter',
    component: SiteCenterComponent,
  },
  {
    path: 'inviteUsers',
    component: InviteUsersModalComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminControlRoutingModule { }
