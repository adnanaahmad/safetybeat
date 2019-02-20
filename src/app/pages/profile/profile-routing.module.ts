import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from 'src/app/core/services/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    // canActivate: [AuthGuard]
  },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
