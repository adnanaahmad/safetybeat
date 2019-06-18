import { Component, OnInit } from '@angular/core';
import {HelperService} from '../../../../shared/helperService/helper.service';

@Component({
  selector: 'app-show-documents',
  templateUrl: './showDocuments.component.html',
  styleUrls: ['./showDocuments.component.scss']
})
export class ShowDocumentsComponent implements OnInit {

  constructor(public helperService: HelperService) { }

  ngOnInit() {
  }

}
