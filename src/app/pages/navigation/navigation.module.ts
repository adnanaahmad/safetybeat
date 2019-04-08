import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationRoutingModule } from './navigation-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FixedNavComponent } from './components/fixedNav/fixedNav.component';
import { NavListComponent } from './components/navList/navList.component';
import { NotificationNavComponent } from './components/notificationNav/notificationNav.component';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';

@NgModule({
  declarations: [
    FixedNavComponent,
    NavListComponent,
    NavigationComponent,
    NotificationNavComponent,
  ],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    MaterialModule
  ],
  providers:[
    CompilerProvider
  ]
})
export class NavigationModule { }
