import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotifcationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { MaterialModule } from 'src/app/shared/material/material.module';

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    NotifcationsRoutingModule,
    MaterialModule
  ]
})
export class NotifcationsModule { }
