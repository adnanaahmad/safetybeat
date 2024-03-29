import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './components/settingsMain/settings.component';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {AuthGuard} from 'src/app/services/core/guards/auth.guard';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {TokenInterceptorService} from 'src/app/services/core/interceptors/tokenInterceptor';
import {MaterialModule} from 'src/app/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OrganizationInfoComponent} from './components/organizationInfo/organizationInfo.component';
import {EntitySettingComponent} from './components/entitySetting/entitySetting.component';
import {ProfileModule} from 'src/app/features/profile/profile.module';
import { PackageComponent } from './components/package/package.component';

@NgModule({
  declarations: [SettingsComponent, OrganizationInfoComponent, EntitySettingComponent, PackageComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileModule,
  ],
  providers: [
    CompilerProvider,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }
  ]
})
export class SettingsModule {
}
