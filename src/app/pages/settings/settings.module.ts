import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './components/settings.component';
import { CompilerProvider } from 'src/app/shared/compiler/compiler';
import { AuthGuard } from 'src/app/core/services/guards/auth.guard';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptorService } from 'src/app/core/services/interceptors/token-interceptor';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ToastrModule } from 'ng6-toastr-notifications';

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MaterialModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    CompilerProvider,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    }
  ]
})
export class SettingsModule { }
