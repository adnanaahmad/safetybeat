import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent {

  constructor(
    public helperService: HelperService
  ) {
    this.helperService.toggleLoader(true)
    this.helperService.appLogger(
      this.helperService.constants.status.SUCCESS,
      this.helperService.translated.LOGGER.MESSAGES.ENTITYCONTROL
    );
  }

  ngOnInit() {
  }
}