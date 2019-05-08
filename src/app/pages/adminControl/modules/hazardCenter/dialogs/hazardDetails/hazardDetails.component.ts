import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-hazard-details',
  templateUrl: './hazardDetails.component.html',
  styleUrls: ['./hazardDetails.component.scss']
})
export class HazardDetailsComponent implements OnInit {
  hazardDetailForm: any;

  constructor(public helperService: HelperService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.hazardDetailForm = this.formBuilder.group({
      risk: ['', Validators.required],
      resolvedBy: ['', Validators.required],
      addedBy: ['', Validators.required]
    });
    this.hazardDetailsControl['risk'].setValue(this.data.data.title);
    this.hazardDetailsControl['resolvedBy'].setValue(this.data.data.resolvedBy);
    this.hazardDetailsControl['addedBy'].setValue(this.data.data.addedBy);

  }
  get hazardDetailsControl() {
    return this.hazardDetailForm.controls;
  }

}
