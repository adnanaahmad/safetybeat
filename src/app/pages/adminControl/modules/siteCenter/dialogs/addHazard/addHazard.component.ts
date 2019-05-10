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
  hazardObj: AddHazardModel = <AddHazardModel>{};


  constructor(public formBuilder: FormBuilder,
    public helperService: HelperService,
    public service: AdminControlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddHazardComponent>) { }

  ngOnInit() {
    this.hazardObj.addHazardForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      risk: ['']
    });
    this.hazardObj.formType = this.data.type;
    this.service.getHazards().subscribe((res) => {
        this.hazardObj.risks = res;
      }, (error) => {
        this.hazardObj.addHazardForm.disable();
        this.helperService.createSnack(this.helperService.translated.MESSAGES.HAZARD_LIST_FAIL,
          this.helperService.constants.status.ERROR);
      }
    );
  }
  get addHazardControls() {
    return this.hazardObj.addHazardForm.controls;
  }

  onFileSelected(event) {
    this.hazardObj.image = <File>event.target.files[0];
  }

  addHazard({ value, valid }: { value: NewHazard; valid: boolean }): void {
    let formData = new FormData();
    if(this.hazardObj.image){
     let blob = new Blob([this.hazardObj.image], { type: 'application/image' });
     formData.append('image', blob, this.hazardObj.image.name);
    }
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
