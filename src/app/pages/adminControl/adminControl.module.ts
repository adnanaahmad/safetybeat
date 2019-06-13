import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminControlRoutingModule } from './adminControl-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import {EntityControlModule} from './modules/entityControl/entityControl.module';
import {HazardCenterModule} from './modules/hazardCenter/hazardCenter.module';
import {MemberCenterModule} from './modules/memberCenter/memberCenter.module';
import {PermissionCenterModule} from './modules/permissionCenter/permissionCenter.module';
import {QuestionCenterModule} from './modules/questionCenter/questionCenter.module';
import {SiteCenterModule} from './modules/siteCenter/siteCenter.module';
import {MyTeamModule} from './modules/myTeam/myTeam.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MaterialModule,
    AdminControlRoutingModule,
    EntityControlModule,
    HazardCenterModule,
    MemberCenterModule,
    PermissionCenterModule,
    QuestionCenterModule,
    SiteCenterModule,
    MyTeamModule
  ],
  providers: [
    CompilerProvider
  ]
})
export class AdminControlModule { }
