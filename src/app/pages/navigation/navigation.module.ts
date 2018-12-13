import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing.module';
import { FixedNavComponent } from './fixed-nav/fixed-nav.component';
import { NavListComponent } from './nav-list/nav-list.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { NavigationComponent } from './navigation.component';

@NgModule({
  declarations: [FixedNavComponent, NavListComponent, NavigationComponent],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    MaterialModule
  ]
})
export class NavigationModule { }
