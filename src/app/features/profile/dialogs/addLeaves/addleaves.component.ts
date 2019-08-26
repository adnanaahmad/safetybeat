import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {ProfileService} from 'src/app/features/profile/services/profile.service';
import {LeaveTypes, LeavesData, ProfileModel} from 'src/app/models/profile/profile.model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NavigationService} from 'src/app/features/navigation/services/navigation.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AddLeaveData} from 'src/app/models/profile.model';

@Component({
  selector: 'app-addleaves',
  templateUrl: './addleaves.component.html',
  styleUrls: ['./addleaves.component.scss']
})
export class AddleavesComponent implements OnInit {
  leavesModel: ProfileModel = <ProfileModel>{};
  isEdit = false;

  constructor(
    public helperService: HelperService,
    private profileService: ProfileService,
    private formBuilder: FormBuilder,
    private navService: NavigationService,
    @Inject(MAT_DIALOG_DATA) public data: LeavesData,
    public dialogRef: MatDialogRef<AddleavesComponent>
  ) {
    this.leavesModel.loading = false;
    this.leavesModel.leaveTypes = Object.assign([], this.data.leaveTypes);
    this.leavesModel.selectedLeave = this.leavesModel.leaveTypes[0];
    this.leavesModel.startAt = new Date();
  }

  ngOnInit() {
    this.isEdit = this.data.currentData === null ? false : true;
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
    this.addLeaveFormValidations['leaveType'].setValue(this.leavesModel.selectedLeave);
    if(this.data.currentData !== null) {
      this.addLeaveFormValidations['description'].setValue(this.data.currentData[0].title);
      this.addLeaveFormValidations['dateFrom'].setValue(new Date(this.data.currentData[0].start));
      this.addLeaveFormValidations['dateTo'].setValue(new Date(this.data.currentData[0].end));
      this.addLeaveFormValidations['leaveType'].setValue(this.data.currentData[0].leaveType.id);
    }
  }

  /**
   * add leaves form validations
   */

  get addLeaveFormValidations() {
    return this.leavesModel.leaveForm.controls;
  }

  onNoClick() {
    this.dialogRef.close();
  }


  /**
   * following function is used to add leaves
   * @params leaveForm
   */
  addLeavesSubmit(leaveForm: FormGroup) {
    this.data.currentData === null ? this.addLeave(leaveForm) : this.editLeave(leaveForm);
  }

  /**
   * Add new leave
   * @param leaveForm 
   */
  addLeave(leaveForm: FormGroup) {
    this.leavesModel.loading = true;
    let data: AddLeaveData = {
      entity: this.leavesModel.entity.id,
      description: leaveForm.value.description,
      leaveType: leaveForm.value.leaveType,
      dateFrom: new Date(leaveForm.value.dateFrom),
      dateTo: new Date(leaveForm.value.dateTo)
    };
    this.profileService.addLeaves(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.leavesModel.leave = res.data.leave;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
        this.leavesModel.loading = false;
        this.onNoClick();
      } else {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
        this.leavesModel.loading = false;
        this.onNoClick();
      }
    }, (error) => {
      this.leavesModel.loading = false;
      this.onNoClick();
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }

  /**
   * Edit current leave
   * @param leaveForm 
   */
  editLeave(leaveForm: FormGroup) {
    this.leavesModel.loading = true;
    let data: AddLeaveData = {
      entity: this.leavesModel.entity.id,
      description: leaveForm.value.description,
      leaveType: leaveForm.value.leaveType,
      dateFrom: new Date(leaveForm.value.dateFrom),
      dateTo: new Date(leaveForm.value.dateTo)
    };
    this.profileService.editLeaves(this.data.currentData[0].leaveId, data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.leavesModel.leave = res.data.leave;
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS);
        this.leavesModel.loading = false;
        this.onNoClick();
      } else {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR);
        this.leavesModel.loading = false;
        this.onNoClick();
      }
    }, (error) => {
      this.leavesModel.loading = false;
      this.onNoClick();
      this.helperService.createSnack(error.error, this.helperService.constants.status.ERROR);
    });
  }
}
