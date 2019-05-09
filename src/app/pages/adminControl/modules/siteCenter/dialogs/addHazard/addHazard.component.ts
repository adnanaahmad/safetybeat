import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AddHazardModel, NewHazard } from 'src/app/models/hazard.model';
import { AdminControlService } from 'src/app/pages/adminControl/services/adminControl.service';

@Component({
  selector: 'app-addHazard',
  templateUrl: './addHazard.component.html',
  styleUrls: ['./addHazard.component.scss']
})
export class AddHazardComponent implements OnInit {
  private addHazardForm: FormGroup;
  hazardObj: AddHazardModel = <AddHazardModel>{};
  risks: string[];
  fileInputTextDiv: any;
  fileInput: any;
  fileInputText: any;

  constructor(public formBuilder: FormBuilder,
    public helperService: HelperService,
    public service: AdminControlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddHazardComponent>) { }

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
    this.fileInputTextDiv = document.getElementById('file_input_text_div');
    this.fileInput = document.getElementById('file_input_file');
    this.fileInputText = document.getElementById('file_input_text');
    this.fileInput.addEventListener('change', this.changeInputText);
    this.fileInput.addEventListener('change', this.changeState);
  }
  changeInputText() {
    var str = this.fileInput.value;
    var i;
    if (str.lastIndexOf('\\')) {
      i = str.lastIndexOf('\\') + 1;
    } else if (str.lastIndexOf('/')) {
      i = str.lastIndexOf('/') + 1;
    }
    this.fileInputText.value = str.slice(i, str.length);
  }
  changeState() {
    if (this.fileInputText.value.length != 0) {
      if (!this.fileInputTextDiv.classList.contains("is-focused")) {
        this.fileInputTextDiv.classList.add('is-focused');
      }
    } else {
      if (this.fileInputTextDiv.classList.contains("is-focused")) {
        this.fileInputTextDiv.classList.remove('is-focused');
      }
    }
  }
  get addHazardControls() {
    return this.addHazardForm.controls;
  }

  onFileSelected(event) {
    this.hazardObj.image = <File>event.target.files[0];
  }

  addHazard({ value, valid }: { value: NewHazard; valid: boolean }): void {
    let blob = new Blob([this.hazardObj.image], { type: 'application/image' });
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
