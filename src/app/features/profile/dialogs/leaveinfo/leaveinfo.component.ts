import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Leaveinfodata} from 'src/app/models/profile.model';

@Component({
  selector: 'app-leaveinfo',
  templateUrl: './leaveinfo.component.html',
  styleUrls: ['./leaveinfo.component.scss']
})
export class LeaveinfoComponent implements OnInit {
  userLeavesData: Array<Leaveinfodata>;

  constructor(
    public helperService: HelperService,
    private dialogRef: MatDialogRef<LeaveinfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<Leaveinfodata>,
  ) {
    if (data) {
      this.userLeavesData = this.data;
    }
  }

  ngOnInit() {
  }

  editLeave() {
    this.dialogRef.close(this.userLeavesData);
  }

}
