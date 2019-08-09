import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/services/common/helperService/helper.service';
import { NotificationService } from 'src/app/features/navigation/services/notification.service';
import { Translation } from 'src/app/models/translate.model';
import {NotificationList, RequestObject} from 'src/app/models/navigation/notification.model';

@Component({
  selector: 'app-notificationNav',
  templateUrl: './notificationNav.component.html',
  styleUrls: ['./notificationNav.component.scss']
})
export class NotificationNavComponent implements OnInit {
  sentRequest: string = "";
  daysAgo: string = "";
  translated: Translation;
  directMessages: any[];
  requests: RequestObject[] = [];

  constructor(
    public helperService: HelperService,
    public notificationService: NotificationService
  ) {
    this.translated = this.helperService.translated;
    // this.constructDirectMessages()
    this.constructRequests();
  }

  ngOnInit() {

  }

  /**
   * Get direct messages
   */
  constructDirectMessages() {
    this.notificationService.getDirectMessages().subscribe((response : any) => {
      // if(response && response.data && response.data.Requests.length) {
        this.directMessages = response;
       
      // }
    }, (error) => {

    })
  }

  /**
   * Get requests array 
   */
  constructRequests() {
    this.notificationService.getRequestsData().subscribe((response : NotificationList) => {
      if(response && response.data && response.data.Requests.length) {
        this.requests = response.data.Requests
       
      }
    }, (error) => {

    })
  }

}
