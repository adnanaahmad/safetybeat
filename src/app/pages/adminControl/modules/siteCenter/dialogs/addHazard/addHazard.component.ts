import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AddHazardModel, NewHazard} from 'src/app/models/hazard.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';

@Component({
  selector: 'app-addHazard',
  templateUrl: './addHazard.component.html',
  styleUrls: ['./addHazard.component.scss']
})
export class AddHazardComponent implements OnInit {
  hazardObj: AddHazardModel = <AddHazardModel>{};
  selectedRisk: any;


  constructor(public formBuilder: FormBuilder,
              public helperService: HelperService,
              public adminControlService: AdminControlService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AddHazardComponent>) {
    debugger;
    this.hazardObj.formType = this.data.type;
    this.selectedRisk = this.data.data.risk;
  }

  ngOnInit() {
    this.hazardObj.addHazardForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      risk: ['']
    });
    this.addHazardControls['risk'].setValue(this.selectedRisk);
    this.setHazardTypes();
    if (this.data.type === 'edit') {
      this.setEditValues();
    }

  }

  setHazardTypes() {
    this.adminControlService.getHazards().subscribe((res) => {

        this.hazardObj.risks = res;
      }, (error) => {
        this.hazardObj.addHazardForm.disable();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_LIST_FAIL,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  setEditValues() {
    this.addHazardControls['risk'].setValue(this.data.data.risk.name);
    this.addHazardControls['title'].setValue(this.data.data.hazard.title);
    this.addHazardControls['description'].setValue(this.data.data.hazard.description);
  }

  get addHazardControls() {
    return this.hazardObj.addHazardForm.controls;
  }

  onFileSelected(event) {
    this.hazardObj.image = <File>event.target.files[0];
  }

  addHazard({value, valid}: { value: NewHazard; valid: boolean }): void {
    let blob = new Blob([this.hazardObj.image], {type: 'application/image'});
    let formData = new FormData();
    formData.append('image', blob, this.hazardObj.image.name);
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('site', this.data.id);
    formData.append('risk', value.risk);
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    this.adminControlService.addNewHazard(formData).subscribe((res) => {
        this.helperService.createSnack('Hazard Added', this.helperService.constants.status.SUCCESS);
        this.onNoClick();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ADDED, this.helperService.constants.status.SUCCESS);

      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  editHazard({id, value}: { id: number; value: NewHazard }): void {
    let blob = new Blob([this.hazardObj.image], {type: 'application/image'});
    let formData = new FormData();
    formData.append('image', blob, this.hazardObj.image.name);
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('site', this.data.id);
    formData.append('risk', value.risk);
    this.adminControlService.editHazard(id, formData).subscribe((res) => {
        this.onNoClick();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDITED, this.helperService.constants.status.SUCCESS);

      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_FAIL,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
