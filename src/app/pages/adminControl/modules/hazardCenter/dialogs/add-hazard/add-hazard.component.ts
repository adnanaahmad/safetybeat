import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-add-hazard',
  templateUrl: './add-hazard.component.html',
  styleUrls: ['./add-hazard.component.scss']
})
export class AddHazardComponent implements OnInit {
  private addHazardForm: FormGroup;

  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addHazardForm = this.formBuilder.group({
      add: ['', Validators.required]
  });
  }

  get addHazardControls() {
    return this.addHazardForm.controls;
  }

}
