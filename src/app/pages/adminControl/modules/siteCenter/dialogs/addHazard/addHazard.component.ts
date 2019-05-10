import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
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
  private addHazardForm: FormGroup;
  hazardObj: AddHazardModel = <AddHazardModel>{};
  risks: string[];

  constructor(public formBuilder: FormBuilder,
              public helperService: HelperService,
              public service: AdminControlService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AddHazardComponent>) {
  }

  ngOnInit() {
    this.addHazardForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      risk: ['']
    });
    this.service.getHazards().subscribe((res) => {
        this.risks = res;
      }, (error) => {
        this.addHazardForm.disable();
        this.helperService.createSnack('Hazard list could not be added',
          this.helperService.constants.status.ERROR);
      }
    );
    this.hazardObj.image = null;
    this.hazardObj.imageName = null;
    this.hazardObj.blob = null;

  }

  get addHazardControls() {
    return this.addHazardForm.controls;
  }

  onFileSelected(event) {
    if (<File>event.target.files[0]) {
      this.hazardObj.image = <File>event.target.files[0];
      this.hazardObj.blob = new Blob([this.hazardObj.image], {type: 'image/*'});
      this.hazardObj.imageName = this.hazardObj.image.name;
    }
  }

  addHazard({value, valid}: { value: NewHazard; valid: boolean }): void {
    let formData = new FormData();
    // let blob = new Blob([this.hazardObj.image], {type: 'image/*'});
    formData.append('image', this.hazardObj.blob, this.hazardObj.imageName);
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('site', this.data.id);
    formData.append('risk', value.risk);
    if (!valid) {
      this.helperService.appLogger(this.helperService.translated.STATUS.ERROR, this.helperService.translated.MESSAGES.INVALID_DATA);
      return;
    }
    this.service.addNewHazard(formData).subscribe((res) => {
        this.helperService.createSnack('Hazard Added', this.helperService.constants.status.SUCCESS);
        this.onNoClick();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ADDED, this.helperService.constants.status.SUCCESS);

      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
