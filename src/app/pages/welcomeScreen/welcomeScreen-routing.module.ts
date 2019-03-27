import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeScreenComponent } from './components/welcomeScreen/welcomeScreen.component';
import { CreateEntityComponent } from './components/createEntity/createEntity.component';
import { AuthGuard } from 'src/app/core/services/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: WelcomeScreenComponent
  },
  {
    path: 'entityCreation',
    canActivate: [AuthGuard],
    component: CreateEntityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeScreenRoutingModule { }
