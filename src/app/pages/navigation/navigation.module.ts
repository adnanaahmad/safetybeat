import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing.module';
import { FixedNavComponent } from './components/fixed-nav/fixed-nav.component';
import { NavListComponent } from './components/nav-list/nav-list.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ToastrModule } from 'ng6-toastr-notifications';



@NgModule({
  declarations: [FixedNavComponent, NavListComponent, NavigationComponent],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    MaterialModule,
    ToastrModule.forRoot(),
  ]
})
export class NavigationModule { }
