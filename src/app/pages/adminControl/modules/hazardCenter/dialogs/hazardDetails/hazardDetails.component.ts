import { Component, Inject, OnInit } from '@angular/core';
import { HelperService } from 'src/app/shared/helperService/helper.service';
import { MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { ImageLightboxComponent } from 'src/app/Dialogs/imageLightbox/imageLightbox.component';

@Component({
  selector: 'app-hazard-details',
  templateUrl: './hazardDetails.component.html',
  styleUrls: ['./hazardDetails.component.scss']
})
export class HazardDetailsComponent implements OnInit {
  hazardDetailForm: any;
  hazardInfo: any;

  constructor(public helperService: HelperService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.hazardDetailForm = this.formBuilder.group({
      risk: ['', Validators.required],
      resolvedBy: ['', Validators.required],
      addedBy: ['', Validators.required]
    });
    this.hazardInfo = this.data;
  }

  testingFunc() {
    this.helperService.createDialog(ImageLightboxComponent,
      { data: { message: this.helperService.translated.CONFIRMATION.DELETE_HAZARD } });
  }
}
