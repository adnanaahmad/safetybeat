import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Leaveinfodata, leaveDeleteData} from 'src/app/models/profile.model';

@Component({
  selector: 'app-leaveinfo',
  templateUrl: './leaveinfo.component.html',
  styleUrls: ['./leaveinfo.component.scss']
})
export class LeaveinfoComponent implements OnInit {
  userLeaveData: Leaveinfodata;
  isEditable: boolean = false;

  constructor(
    public helperService: HelperService,
    private dialogRef: MatDialogRef<LeaveinfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Leaveinfodata,
  ) {
    if (data) {
      this.userLeaveData = this.data[0];
      if(this.userLeaveData && !this.userLeaveData.approved) {
        this.isEditable = true
      }
    }
  }

  ngOnInit() {
  }

  editLeave() {
    let obj = {
      leaveData: this.userLeaveData,
      delete: false
    }
    this.dialogRef.close(obj);
  }

  deleteLeave() {
    let obj = {
      leaveData: this.userLeaveData,
      delete: true
    }
    this.dialogRef.close(obj);
  }

}
