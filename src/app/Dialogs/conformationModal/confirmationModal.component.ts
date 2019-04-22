import {Component, OnInit} from '@angular/core';
import {Translation} from '../../models/translate.model';

@Component({
  selector: 'app-confirmationModal',
  templateUrl: './confirmationModal.component.html',
  styleUrls: ['./confirmationModal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {

  translated: Translation

  constructor() {
  }

  ngOnInit() {
  }

}
