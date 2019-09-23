import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CheckInCategory, CheckInTypesCat, PulseCategory} from 'src/app/models/adminControl/entityControl.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';
import {removeDisabledFailures} from 'tslint';

@Component({
  selector: 'app-check-in-category-modal',
  templateUrl: './checkInCategoryModal.component.html',
  styleUrls: ['./checkInCategoryModal.component.scss']
})
export class CheckInCategoryModalComponent implements OnInit {
  checkInCategoryModal: CheckInCategory = <CheckInCategory>{};


  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public helperService: HelperService,
              public formBuilder: FormBuilder,
              private adminServices: AdminControlService) {
  }

  ngOnInit() {
    this.checkInCategoryModal.addCheckInTypeForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
    this.getCheckInsType();
  }

  getCheckInsType() {
    let entity = {
      id: this.data
    }
    this.adminServices.checkInTypes(entity).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.checkInCategoryModal.checkInTypes = res.data;
        this.checkInCategoryModal.disableRemove = false;
        if (this.checkInCategoryModal.checkInTypes.length === 1) {
          this.checkInCategoryModal.disableRemove = true;
        }
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.checkInCategoryModal.checkInTypes = null;
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  addCheckIn(form) {
    let data = {
      name: form.value.title,
      entity: this.data
    }
    this.adminServices.addCheckInTypes(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS)
        this.getCheckInsType();
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[5]) {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.WARNING)
        this.getCheckInsType();
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR)
        this.getCheckInsType();
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  archiveCheckIn(id) {
    let data = {
      'id': id
    }
    this.adminServices.archiveCheckInType(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.getCheckInsType();
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

}
