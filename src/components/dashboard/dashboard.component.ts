import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  organizationForm: FormGroup;
  moduleForm: FormGroup;
  packageForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit() {
    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      // organizationSize: ['', Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      // city: ['', Validators.required],
      // country: ['', Validators.required],
      fax: ['', Validators.required],
      billingEmail: ['', Validators.required],
      accountNo: ['', Validators.required],
      phoneNo: ['', Validators.required]
    });
    this.moduleForm = this.formBuilder.group({
      // name: ['', Validators.required]
    })
    this.packageForm = this.formBuilder.group({
      // packageName: ['', Validators.required],
      // cost: ['', Validators.required],
      // noOfUsers: ['', Validators.required]
    })
  }
  get o() { return this.organizationForm.controls; }
  get mod() { return this.moduleForm.controls; }
  get pac() { return this.packageForm.controls; }
}
