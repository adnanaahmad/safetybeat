import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteCenterRoutingModule } from './siteCenter-routing.module';
import {SiteCenterComponent} from './components/siteCenter/siteCenter.component';
import {MaterialModule} from '../../../../shared/material/material.module';
import {ViewSiteComponent} from './components/viewSite/viewSite.component';

@NgModule({
  declarations: [
    SiteCenterComponent,
    ViewSiteComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SiteCenterRoutingModule,
  ]
})
export class SiteCenterModule { }
