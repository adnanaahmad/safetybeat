import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { UserComponent } from './components/user/user.component';
import { OrganizationComponent } from './components/organization/organization.component';

const routes: Routes = [
  { path: '', component: ProfileComponent },
  { path: 'user', component: UserComponent },
  { path: 'organization', component: OrganizationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
