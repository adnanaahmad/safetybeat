import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileRoutingModule} from './profile-routing.module';
import {ProfileComponent} from './components/profile/profile.component';
import {UserComponent} from './components/user/user.component';
import {MaterialModule} from 'src/app/material.module';
import {ProfileService} from './services/profile.service';
import {HTTP_INTERCEPTORS, HttpClientModule, HttpClient} from '@angular/common/http';
import {AuthGuard} from 'src/app/services/core/guards/auth.guard';
import {TokenInterceptorService} from 'src/app/services/core/interceptors/tokenInterceptor';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {RouterModule} from '@angular/router';
import {CalendarCommonModule, CalendarModule} from 'angular-calendar';
import {FlatpickrModule} from 'angularx-flatpickr';

@NgModule({
  declarations: [ProfileComponent, UserComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    HttpClientModule,
    CalendarCommonModule,
    CalendarModule,
    FlatpickrModule
  ],
  exports: [
    UserComponent
  ],
  providers: [
    ProfileService,
    CompilerProvider,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }
  ]
})
export class ProfileModule {
}
