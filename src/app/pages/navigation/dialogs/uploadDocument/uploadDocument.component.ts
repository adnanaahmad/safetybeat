import { Component, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-uploadDocument',
  templateUrl: './uploadDocument.component.html',
  styleUrls: ['./uploadDocument.component.scss']
})
export class UploadDocumentComponent implements OnInit {

  constructor(
    public helperService: HelperService
  ) { }

  ngOnInit() {
  }

}
