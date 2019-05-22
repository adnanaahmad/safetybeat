import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {AddHazardModel, Hazard, NewHazard} from 'src/app/models/hazard.model';
import {AdminControlService} from 'src/app/pages/adminControl/services/adminControl.service';

@Component({
  selector: 'app-addHazard',
  templateUrl: './addHazard.component.html',
  styleUrls: ['./addHazard.component.scss']
})
export class AddHazardComponent implements OnInit {
  hazardObj: AddHazardModel = <AddHazardModel>{};
  hazardInfo: Hazard = <Hazard>{};
  risks: string[];
  public serverUrl: string;
  public url: string;

  constructor(
    public formBuilder: FormBuilder,
    public helperService: HelperService,
    public service: AdminControlService,
    public dialogRef: MatDialogRef<AddHazardComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.hazardObj.editModal = data.Modal;
    this.hazardInfo = data.hazardInfo;
    this.serverUrl = this.helperService.appConstants.serverUrl;
    this.url = helperService.appConstants.noHazard

  }

  ngOnInit() {
    this.hazardObj.addHazardForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      risk: ['']
    });
    this.getRisks();
    if (this.hazardObj.editModal) {
      this.viewHazardInfo();
    }
  }

  viewHazardInfo() {
    if (this.hazardInfo.hazard.image) {
      this.url = this.serverUrl + this.hazardInfo.hazard.image;
    }
    this.hazardObj.addHazardForm = this.formBuilder.group({
      title: this.hazardInfo.hazard.title,
      description: this.hazardInfo.hazard.description,
      risk: this.hazardInfo.risk.id
    })
  }

  getRisks() {
    this.service.getRisks().subscribe((res) => {
        this.risks = res;

      }, (error) => {
        this.hazardObj.addHazardForm.disable();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_LIST_FAIL,
          this.helperService.constants.status.ERROR);
      }
    );
  }

  hazardFormSubmit({value}: { value: NewHazard }) {
    this.hazardObj.editModal ? this.editHazard(value) : this.addHazard(value);
  }

  get addHazardControls() {
    return this.hazardObj.addHazardForm.controls;
  }

  onFileSelected(file: FileList) {
    this.hazardObj.removeImage = 'False';
    this.hazardObj.image = file.item(0);
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.url = event.target.result;
    }
    reader.readAsDataURL(this.hazardObj.image);
  }


  removePicture() {
    this.url = this.helperService.appConstants.noHazard;
    this.hazardObj.removeImage = 'True';
  }

  generateHazardData(value, editHazard) {
    let formData = new FormData();
    formData.append('title', value.title);
    formData.append('description', value.description);
    formData.append('risk', value.risk);
    formData.append('removeImage', this.hazardObj.removeImage);
    if (this.hazardObj.image) {
      let blob = new Blob([this.hazardObj.image], {type: 'application/image'});
      formData.append('image', blob, this.hazardObj.image.name);
    }
    if (editHazard) {
      formData.append('site', this.hazardInfo.hazard.site);
      formData.append('addedBy', this.hazardInfo.hazard.addedBy);
    } else {
      formData.append('site', this.data.siteId);
    }
    return formData;
  }

  addHazard(value) {
    this.service.addHazard(this.generateHazardData(value, false)).subscribe((res) => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.onNoClick();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_ADDED,
            this.helperService.constants.status.SUCCESS);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_NOT_ADDED,
          this.helperService.constants.status.ERROR);
      }
    );
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  editHazard(value) {
    this.service.editHazard(this.hazardInfo.hazard.id, this.generateHazardData(value, true)).subscribe((res) => {
        if (res.responseDetails.code === this.helperService.appConstants.codeValidations[0]) {
          this.onNoClick();
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_SUCCESS,
            this.helperService.constants.status.SUCCESS);
        } else if (res.responseDetails.code === this.helperService.appConstants.codeValidations[4]) {
          this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_FAILURE,
            this.helperService.constants.status.ERROR);
        }
      }, (error) => {
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_EDIT_FAILURE,
          this.helperService.constants.status.ERROR);
      }
    );
  }
}
