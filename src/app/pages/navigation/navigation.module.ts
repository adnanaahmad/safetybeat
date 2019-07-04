import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationRoutingModule} from './navigation-routing.module';
import {MaterialModule} from 'src/app/shared/material/material.module';
import {NavigationComponent} from './components/navigation/navigation.component';
import {FixedNavComponent} from './components/fixedNav/fixedNav.component';
import {NavListComponent} from './components/navList/navList.component';
import {NotificationNavComponent} from './components/notificationNav/notificationNav.component';
import {CompilerProvider} from 'src/app/shared/compiler/compiler';
import {DocumentsComponent} from './components/documents/documents.component';
import {ShowDocumentsComponent} from './components/showDocuments/showDocuments.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    FixedNavComponent,
    NavListComponent,
    NavigationComponent,
    NotificationNavComponent,
    DocumentsComponent,
    ShowDocumentsComponent    
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
