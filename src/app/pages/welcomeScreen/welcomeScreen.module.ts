import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeScreenComponent } from './components/welcomeScreen/welcomeScreen.component';
import { WelcomeScreenRoutingModule } from './welcomeScreen-routing.module';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ParticleContainerComponent2 } from 'src/app/core/components/particleContainer/particleContainer2.component';
import { CoreModule } from 'src/app/core/core.module';
import { CreateEntityComponent } from './components/createEntity/createEntity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from 'src/app/core/services/interceptors/tokenInterceptor';


@NgModule({
  declarations: [
    WelcomeScreenComponent,
    CreateEntityComponent,
  ],
  imports: [
    CommonModule,
    WelcomeScreenRoutingModule,
    MaterialModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    CompilerProvider,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
  ]
})
export class WelcomeScreenModule { }
