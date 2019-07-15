import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationRoutingModule} from './navigation-routing.module';
import {MaterialModule} from 'src/app/material.module';
import {NavigationComponent} from './components/navigation/navigation.component';
import {FixedNavComponent} from './components/fixedNav/fixedNav.component';
import {NavListComponent} from './components/navList/navList.component';
import {NotificationNavComponent} from './components/notificationNav/notificationNav.component';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {FormsModule} from '@angular/forms';
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
    FormsModule
  ],
  providers: [
    CompilerProvider
  ]
})
export class NavigationModule {
}
