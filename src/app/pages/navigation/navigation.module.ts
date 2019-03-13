import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationRoutingModule } from './navigation-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { FixedNavComponent } from './components/fixedNav/fixedNav.component';
import { NavListComponent } from './components/navList/navList.component';
import { NotificationNavComponent } from './components/notificationNav/notificationNav.component';

@NgModule({
  declarations: [
    FixedNavComponent,
    NavListComponent,
    NavigationComponent,
    NotificationNavComponent
  ],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    MaterialModule,
    ToastrModule.forRoot(),
  ]
})
export class NavigationModule { }
