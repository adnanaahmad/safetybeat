import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeScreenComponent } from './components/welcomeScreen/welcomeScreen.component';
import { CreateEntityComponent } from './components/createEntity/createEntity.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomeScreenComponent
  },
  {
    path: 'entityCreation',
    component: CreateEntityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WelcomeScreenRoutingModule { }
