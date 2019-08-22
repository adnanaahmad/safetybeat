import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/common/helperService/helper.service';
import { NotificationService } from 'src/app/features/navigation/services/notification.service';
import { Translation } from 'src/app/models/translate.model';
import {DirectNotificationList, DirectObject, NotificationList, RequestObject} from 'src/app/models/navigation/notification.model';

@Component({
  selector: 'app-notificationNav',
  templateUrl: './notificationNav.component.html',
  styleUrls: ['./notificationNav.component.scss']
})
export class NotificationNavComponent implements OnInit {
  translated: Translation;
  directMessages: DirectObject[] = [];
  requests: RequestObject[] = [];

  constructor(
    public helperService: HelperService,
    public notificationService: NotificationService
  ) {
    this.translated = this.helperService.translated;
    this.constructRequests();
    this.constructDirectMessages();
  }

  ngOnInit() {
  }

  /**
   * Get direct messages
   */
  constructDirectMessages() {
    this.notificationService.getDirectMessages().subscribe((response: DirectNotificationList) => {
      if (response && response.data && response.data.notifications) {
        this.directMessages = response.data.notifications;
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    })
  }

  /**
   * Get requests array
   */
  constructRequests() {
    this.notificationService.getRequestsData().subscribe((response: NotificationList) => {
      if (response && response.data && response.data.requestsList) {
        this.requests = response.data.requestsList;
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    })
  }

}
