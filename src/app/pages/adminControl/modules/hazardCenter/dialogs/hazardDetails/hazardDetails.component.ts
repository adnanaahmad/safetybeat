import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';
import {CompilerProvider} from '../../../../../../shared/compiler/compiler';

@Component({
  selector: 'app-hazard-details',
  templateUrl: './hazardDetails.component.html',
  styleUrls: ['./hazardDetails.component.scss']
})
export class HazardDetailsComponent implements OnInit {
  hazardDetailForm: any;
  data1: any;


  constructor(public helperService: HelperService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public formBuilder: FormBuilder,
              private compiler: CompilerProvider) { }

  ngOnInit() {
    this.hazardDetailForm = this.formBuilder.group({
      risk: ['', Validators.required],
      resolvedBy: ['', Validators.required],
      addedBy: ['', Validators.required]
    });
    this.data1 = this.data.data;
   // console.log(this.data);
  //  this.hazardDetailsControl['risk'].setValue(this.data.data.hazard.title);
  //  this.hazardDetailsControl['resolvedBy'].setValue(this.data.data.resolvedBy);
   // this.hazardDetailsControl['addedBy'].setValue(this.data.data.user.first_name + ' ' + this.data.data.user.last_name);

  }


}
