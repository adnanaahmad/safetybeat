import {Component, Inject, OnInit} from '@angular/core';
import {HelperService} from '../../../../../../shared/helperService/helper.service';
import {MAT_DIALOG_DATA} from '@angular/material';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-hazard',
  templateUrl: './editHazard.component.html',
  styleUrls: ['./editHazard.component.scss']
})
export class EditHazardComponent implements OnInit {
  editHazardForm: any;

  constructor(public helperService: HelperService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.editHazardForm = this.formBuilder.group({
      risk: ['', Validators.required],
      resolvedBy: ['', Validators.required],
      addedBy: ['', Validators.required],
      title: ['', Validators.required],
      dateTime: ['', Validators.required],
      resolved: ['', Validators.required],
      site: ['', Validators.required]
    });
    this.editHazardForm['risk'].setValue(this.data.data.title);
    this.editHazardForm['resolvedBy'].setValue(this.data.data.resolvedBy);
    this.editHazardForm['addedBy'].setValue(this.data.data.addedBy);
    this.editHazardForm['title'].setValue(this.data.data.addedBy);
    this.editHazardForm['dateTime'].setValue(this.data.data.addedBy);
    this.editHazardForm['resolved'].setValue(this.data.data.addedBy);
    this.editHazardForm['site'].setValue(this.data.data.addedBy);
  }

}
