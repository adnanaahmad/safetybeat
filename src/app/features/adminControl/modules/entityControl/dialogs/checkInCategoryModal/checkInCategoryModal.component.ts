import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {HelperService} from 'src/app/services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {CheckInCategory, CheckInTypesCat} from 'src/app/models/adminControl/entityControl.model';
import {AdminControlService} from 'src/app/features/adminControl/services/adminControl.service';

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
    this.adminServices.checkInTypes(this.data).subscribe((res: Array<CheckInTypesCat>) => {
      this.checkInCategoryModal.checkInTypes = res;
    });
  }

  addCheckIn(form) {
    let data = {
      name: form.value.title,
      entity: this.data
    }
    this.adminServices.addCheckInTypes(data).subscribe((res) => {
      if (res) {
        this.getCheckInsType();
      }
    });
  }

  deleteCheckIn(id) {
    this.adminServices.deleteCheckInType(id).subscribe((res) => {
      this.getCheckInsType();
    });
  }

}
