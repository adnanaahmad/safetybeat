import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlRoutingModule } from './adminControl-routing.module';
import { EntityControlComponent } from './components/entityControl/entityControl.component';
import { HazardCenterComponent } from './components/hazardCenter/hazardCenter.component';
import { MemberCenterComponent } from './components/memberCenter/memberCenter.component';
import { PermissionCenterComponent } from './components/permissionCenter/permissionCenter.component';
import { QuestionCenterComponent } from './components/questionCenter/questionCenter.component';
import { SiteCenterComponent } from './components/siteCenter/siteCenter.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { AddSiteModalComponent } from './components/addSiteModal/addSiteModal.component';

@NgModule({
  declarations: [
    EntityControlComponent,
    HazardCenterComponent,
    MemberCenterComponent,
    PermissionCenterComponent,
    QuestionCenterComponent,
    SiteCenterComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdminControlRoutingModule
  ],
  providers: [
    CompilerProvider
  ]
})
export class AdminControlModule { }
