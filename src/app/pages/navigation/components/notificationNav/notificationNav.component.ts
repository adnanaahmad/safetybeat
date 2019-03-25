import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { Translation } from 'src/app/models/translate.model';

@Component({
  selector: 'app-notificationNav',
  templateUrl: './notificationNav.component.html',
  styleUrls: ['./notificationNav.component.scss']
})
export class NotificationNavComponent implements OnInit {
  translated: Translation;

  constructor(
    public helperService: HelperService,
  ) {
    this.translated = this.helperService.translation;
  }

  ngOnInit() {
  }

}
