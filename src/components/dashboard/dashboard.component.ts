import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from '../../services/registration/registration.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  organizationForm: FormGroup;
  moduleForm: FormGroup;
  packageForm: FormGroup;

  types: any = [
    {
      "name": "IT"
    },
    {
      "name": "Business"
    },
    {
      "name": "Architecture"
    },
    {
      "name": "Educational"
    }
  ]
  modules: any = [
    {
      "id": 1,
      "name": "Safetybeat"
    },
    {
      "id": 2,
      "name": "Field Communication"
    }
  ]
  packages: any = [
    {
      packageName: "standard",
      cost: "50$",
      noOfUsers: "10-15"
    },
    {
      packageName: "express",
      cost: "150$",
      noOfUsers: "25-75"
    },
    {
      packageName: "premium",
      cost: "500$",
      noOfUsers: "100-250"
    }
  ]
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private regService: RegistrationService,
  ) {
    this.regService.companyType()
      .subscribe(data => {
        debugger
        console.log("data", data)
      },
        error => {
          console.log("error", error)
        });
  }

  ngOnInit() {
    this.organizationForm = this.formBuilder.group({
      name: ['', Validators.required],
      type: [[], Validators.required],
      address: ['', Validators.required],
      zipCode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      fax: ['', Validators.required],
      billingEmail: ['', Validators.required],
      accountNo: ['', Validators.required],
      phoneNo: ['', Validators.required]
    }, { validator: this.checkPasswords });
    this.moduleForm = this.formBuilder.group({
      name: [[], Validators.required]
    })
    this.packageForm = this.formBuilder.group({
      // packageName: ['', Validators.required],
      // cost: ['', Validators.required],
      // noOfUsers: ['', Validators.required]
    })
  }
  checkPasswords(group: FormGroup) {
    const pass = group.controls.type.value;
  }
  get orgForm() { return this.organizationForm.controls; }
  get modForm() { return this.moduleForm.controls; }
  get pac() { return this.packageForm.controls; }
}
