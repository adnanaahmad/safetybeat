import { Component, Inject, OnInit } from '@angular/core';
import { Translation } from 'src/app/models/translate.model';
import { HelperService } from 'src/app/services/common/helperService/helper.service';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirmationModal',
  templateUrl: './confirmationModal.component.html',
  styleUrls: ['./confirmationModal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  translated: Translation
  message: string;
  constructor(
    private helperService: HelperService,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.message = this.data.message
  }

  ngOnInit() {
  }

}
