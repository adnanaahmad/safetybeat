import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { UserComponent } from './components/user/user.component';
import { OrganizationComponent } from './components/organization/organization.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ProfileService } from './services/profile.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { AuthGuard } from 'src/app/core/services/guards/auth.guard';
import { TokenInterceptorService } from 'src/app/core/services/interceptors/token-interceptor';

@NgModule({
  declarations: [ProfileComponent, UserComponent, OrganizationComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule
  ], providers: [
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
export class ProfileModule { }
