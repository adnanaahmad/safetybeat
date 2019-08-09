import {Component, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-advanceSearch',
  templateUrl: './advanceSearch.component.html',
  styleUrls: ['./advanceSearch.component.scss']
})
export class AdvanceSearchComponent implements OnInit {

  constructor(
    public helperService: HelperService,
    public dialogRef: MatDialogRef<AdvanceSearchComponent>,
  ) {
  }

  ngOnInit() {
  }

  onNoClick() {
    this.dialogRef.close();
  }
}
