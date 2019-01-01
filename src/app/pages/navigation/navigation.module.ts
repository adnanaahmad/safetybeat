import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationRoutingModule } from './navigation-routing.module';
import { FixedNavComponent } from './components/fixed-nav/fixed-nav.component';
import { NavListComponent } from './components/nav-list/nav-list.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ToastrModule } from 'ng6-toastr-notifications';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { createTranslateLoader } from 'src/app/app.module';
import { HttpClient } from '@angular/common/http';



@NgModule({
  declarations: [FixedNavComponent, NavListComponent, NavigationComponent],
  imports: [
    CommonModule,
    NavigationRoutingModule,
    MaterialModule,
    ToastrModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
  ]
})
export class NavigationModule { }
