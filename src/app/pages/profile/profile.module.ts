import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserComponent } from './pages/user/user.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ProfileService } from './services/profile.service';
import { AuthGuard } from 'src/app/core/guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from 'src/app/core/interceptors/token-interceptor';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';

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
