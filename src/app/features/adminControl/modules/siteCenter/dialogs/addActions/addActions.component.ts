import {Component, OnInit } from '@angular/core';
import {MemberCenterService} from 'src/app/features/adminControl/modules/memberCenter/services/member-center.service';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatBottomSheetRef} from '@angular/material';

@Component({
  selector: 'app-add-actions',
  templateUrl: './addActions.component.html',
  styleUrls: ['./addActions.component.scss']
})
export class AddActionsComponent implements OnInit {
  private users: any;
  private actionForm: FormGroup;

  constructor(public formBuilder: FormBuilder,
              public memberService: MemberCenterService,
              public helperService: HelperService,
              public bottomSheetRef: MatBottomSheetRef<AddActionsComponent>) { }

  ngOnInit() {
    this.actionForm = this.formBuilder.group({
      title: ['', Validators.required],
      actionUser: ['', Validators.required],
      completeByTime: ['', Validators.required],
      description: ['', Validators.required]

    });
    let data = {
      'entityId': JSON.parse(this.helperService.decrypt(localStorage.getItem(this.helperService.constants.localStorageKeys.entityId),
        this.helperService.appConstants.key))
    };
        this.getAllUsers(data);
  }

  getAllUsers(data) {
    this.memberService.allEntityUsers(data).subscribe((res) => {
      if (res) {
      this.users = res.data;
      }
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  closeSheet(value: string) {
    this.bottomSheetRef.dismiss(value);
  }
}
