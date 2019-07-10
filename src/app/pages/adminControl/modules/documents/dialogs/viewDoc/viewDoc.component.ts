import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-view-doc',
  templateUrl: './viewDoc.component.html',
  styleUrls: ['./viewDoc.component.scss']
})
export class ViewDocComponent implements OnInit {
   file: any
  constructor(public helperService: HelperService,
              public dialogRef: MatDialogRef<ViewDocComponent>,
              @Inject(MAT_DIALOG_DATA) public data,
              private sanitizer: DomSanitizer) {
    this.file =  sanitizer.bypassSecurityTrustResourceUrl(`https://docs.google.com/gview?url=${this.data}&embedded=true"`);
  }

  ngOnInit() {
    this.file =  this.sanitizer.bypassSecurityTrustResourceUrl(this.data);
  }

}
