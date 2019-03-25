import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeScreenComponent } from './components/welcomeScreen/welcomeScreen.component';
import { WelcomeScreenRoutingModule } from './welcomeScreen-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ParticleContainerComponent2 } from 'src/app/core/components/particleContainer/particleContainer2.component';
import { CoreModule } from 'src/app/core/core.module';
import { CreateEntityComponent } from './components/createEntity/createEntity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    WelcomeScreenComponent,
    CreateEntityComponent
  ],
  imports: [
    CommonModule,
    WelcomeScreenRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CoreModule
  ]
})
export class WelcomeScreenModule { }
