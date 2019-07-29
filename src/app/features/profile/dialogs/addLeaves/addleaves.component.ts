import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {ProfileService} from '../../services/profile.service';
import {LeaveTypes, ProfileModel} from 'src/app/models/profile/profile.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {leave} from '@angular/core/src/profile/wtf_impl';

@Component({
  selector: 'app-addleaves',
  templateUrl: './addleaves.component.html',
  styleUrls: ['./addleaves.component.scss']
})
export class AddleavesComponent implements OnInit {
  leavesModel: ProfileModel = <ProfileModel>{};

  constructor(
    public helperService: HelperService,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private navService: NavigationService,
    @Inject(MAT_DIALOG_DATA) public data: Array<LeaveTypes>,
  ) {
    this.leavesModel.leaveTypes = this.data;
    this.leavesModel.selectedLeave = this.leavesModel.leaveTypes[0].id;
    this.leavesModel.startAt = new Date();
  }

  ngOnInit() {
    this.leavesModel.leaveForm = this.formBuilder.group({
      entity: ['', Validators.required],
      description: ['', Validators.required],
      leaveType: ['', Validators.required],
      dateFrom: ['', Validators.required],
      dateTo: ['', Validators.required]
    });

    this.leavesModel.subscription = this.navService.selectedEntityData.subscribe((res) => {
      if (res !== 1) {
        this.leavesModel.entity = res.entityInfo;
        this.addLeaveFormValidations['entity'].setValue(this.leavesModel.entity.name);
        this.addLeaveFormValidations['entity'].disable();
      }
    });
    this.leaveTypesSelection(this.leavesModel.selectedLeave);

  }

  /**
   * add leaves form validations
   */

  get addLeaveFormValidations() {
    return this.leavesModel.leaveForm.controls;
  }


  /**
   * following function is used to add leaves
   * @params leaveForm
   */
  addLeavesSubmit(leaveForm: FormGroup) {
    let data = {
      entity: this.leavesModel.entity.id,
      description: leaveForm.value.description,
      leaveType: leaveForm.value.leaveType,
      dateFrom: leaveForm.value.dateFrom,
      dateTo: leaveForm.value.dateTo
    }
    this.profileService.addLeaves(data).subscribe((res) => {
      debugger
    }, (error) => {
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    })

  }

  leaveTypesSelection(selectedLeave: number) {
    this.addLeaveFormValidations['leaveType'].setValue(this.leavesModel.selectedLeave);
  }

}
