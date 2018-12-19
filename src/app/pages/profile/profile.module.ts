import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserComponent } from './pages/user/user.component';
import { OrganizationComponent } from './pages/organization/organization.component';
import { MaterialModule } from 'src/app/shared/material/material.module';

@NgModule({
  declarations: [ProfileComponent, UserComponent, OrganizationComponent],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MaterialModule
  ]
})
export class ProfileModule { }
