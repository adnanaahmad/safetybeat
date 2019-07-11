import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ImageLightboxComponent} from 'src/app/Dialogs/imageLightbox/imageLightbox.component';
import {Hazard} from 'src/app/models/hazard.model';

@Component({
  selector: 'app-hazard-details',
  templateUrl: './hazardDetails.component.html',
  styleUrls: ['./hazardDetails.component.scss']
})
export class HazardDetailsComponent implements OnInit {
  hazardDetailForm: FormGroup;
  hazardInfo: Hazard;

  constructor(public helperService: HelperService,
              @Inject(MAT_DIALOG_DATA) public data: Hazard,
              public formBuilder: FormBuilder) {
    this.hazardInfo = this.data;

  }

  ngOnInit() {
    this.hazardDetailForm = this.formBuilder.group({
      risk: ['', Validators.required],
      resolvedBy: ['', Validators.required],
      addedBy: ['', Validators.required]
    });
  }

  imageView() {
      this.helperService.createDialog(ImageLightboxComponent,
        {data: {message: this.helperService.translated.CONFIRMATION.DELETE_HAZARD, image: this.hazardInfo.hazard.image}});
  }
}
