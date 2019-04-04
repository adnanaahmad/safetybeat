import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../../../shared/helperService/helper.service';
import { Translation } from '../../../../models/translate.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-addSiteModal',
  templateUrl: './addSiteModal.component.html',
  styleUrls: ['./addSiteModal.component.scss']
})
export class AddSiteModalComponent implements OnInit {

  translated: Translation;
  joinEntityForm: FormGroup;
  appConstants: any;


  constructor(
    public helperService: HelperService,
    public formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddSiteModalComponent>

  ) { 
    this.translated = this.helperService.translation;
    this.appConstants = this.helperService.constants.appConstant;

  }

  ngOnInit() {
    this.joinEntityForm = this.formBuilder.group({
      joinCode: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  get formValidation() { return this.joinEntityForm.controls; }
  

}
