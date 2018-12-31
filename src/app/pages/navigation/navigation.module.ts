import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing.module';
import { FixedNavComponent } from './fixed-nav/fixed-nav.component';
import { NavListComponent } from './nav-list/nav-list.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { NavigationComponent } from './navigation.component';
import { ToastrModule } from 'ng6-toastr-notifications';


@NgModule({
  declarations: [FixedNavComponent, NavListComponent, NavigationComponent],
  imports: [
    CommonModule,
    ToastrModule.forRoot(),
    NavigationRoutingModule,
    MaterialModule
  ]
})
export class NavigationModule { }
