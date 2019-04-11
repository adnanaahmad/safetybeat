import {Component, OnInit} from '@angular/core';
import {Translation} from '../../models/translate.model';
import {HelperService} from '../../shared/helperService/helper.service';

@Component({
  selector: 'app-confirmationModal',
  templateUrl: './confirmationModal.component.html',
  styleUrls: ['./confirmationModal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  translated: Translation

  constructor(
    private helperService: HelperService
  ) {
  }

  ngOnInit() {
  }

}
