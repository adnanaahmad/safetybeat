import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserComponent } from './pages/user/user.component';
import { OrganizationComponent } from './pages/organization/organization.component';

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
