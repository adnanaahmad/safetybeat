import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserComponent } from './pages/user/user.component';
import { OrganizationComponent } from './pages/organization/organization.component';

@NgModule({
  declarations: [ProfileComponent, UserComponent, OrganizationComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule
  ]
})
export class ProfileModule { }
