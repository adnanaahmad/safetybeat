import {Component, Inject, OnInit} from '@angular/core';
import {CheckInCategory, PulseCategory} from '../../../../../../models/adminControl/entityControl.model';
import {MAT_DIALOG_DATA} from '@angular/material';
import {HelperService} from '../../../../../../services/common/helperService/helper.service';
import {FormBuilder, Validators} from '@angular/forms';
import {AdminControlService} from '../../../../services/adminControl.service';

@Component({
  selector: 'app-pulse-categoy-modal',
  templateUrl: './pulseCategoyModal.component.html',
  styleUrls: ['./pulseCategoyModal.component.scss']
})
export class PulseCategoyModalComponent implements OnInit {

  pulseCategoryModal: PulseCategory = <PulseCategory>{};


  constructor(@Inject(MAT_DIALOG_DATA) public data,
              public helperService: HelperService,
              public formBuilder: FormBuilder,
              private adminServices: AdminControlService) {
  }

  ngOnInit() {
    this.pulseCategoryModal.addPulseTypeForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
    this.getPulseType();
  }

  getPulseType() {
    let entity = {
      id: this.data
    }
    this.adminServices.pulseTypes(entity).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.pulseCategoryModal.pulseTypes = res.data;
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.pulseCategoryModal.pulseTypes = null;
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  addPulse(form) {
    let data = {
      name: form.value.title,
      entity: this.data
    }
    this.adminServices.addPulseTypes(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.SUCCESS)
        this.getPulseType();
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[5]) {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.WARNING)
        this.getPulseType();
      } else if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
        this.helperService.createSnack(res.responseDetails.message, this.helperService.constants.status.ERROR)
        this.getPulseType();
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }

  archivePulse(id) {
    let data = {
      'id': id
    }
    this.adminServices.archivePulse(data).subscribe((res) => {
      if (res && res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
        this.getPulseType();
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.ERROR_MSG, this.helperService.constants.status.ERROR);
    });
  }


}
