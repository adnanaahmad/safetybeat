import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WelcomeScreenComponent} from './components/welcomeScreen/welcomeScreen.component';
import {WelcomeScreenRoutingModule} from './welcomeScreen-routing.module';
import {MaterialModule} from 'src/app/material.module';
import {CreateEntityComponent} from './components/createEntity/createEntity.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CompilerProvider} from 'src/app/services/common/compiler/compiler';
import {CoreModule} from '../core/core.module';

@NgModule({
  declarations: [
    WelcomeScreenComponent,
    CreateEntityComponent
  ],
  imports: [
    CommonModule,
    WelcomeScreenRoutingModule,
    MaterialModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule
  ],
  providers: [
    CompilerProvider,
  ],
  exports: []
})
export class WelcomeScreenModule {
}
