import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// services
import { OrganizationService } from '../../services/organization/organization.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  organizationForm: FormGroup;
  moduleForm: FormGroup;
  packageForm: FormGroup;
  selectedPackage: any = {};
  types: any = [
    {
      'name': 'IT'
    },
    {
      'name': 'Business'
    },
    {
      'name': 'Architecture'
    },
    {
      'name': 'Educational'
    }
  ];
  modules: any = [
    {
      'id': 1,
      'name': 'Safetybeat'
    },
    {
      'id': 2,
      'name': 'Field Communication'
    }
  ];
  packages: any = [
    {
      packageName: 'standard',
      cost: '50$',
      noOfUsers: '10-15'
    },
    {
      packageName: 'express',
      cost: '150$',
      noOfUsers: '25-75'
    },
    {
      packageName: 'premium',
      cost: '500$',
      noOfUsers: '100-250'
    }
  ];
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private orgService: OrganizationService,
  ) {
    this.orgService.companyType()
      .subscribe(data => {
        console.log('data', data);
      },
        error => {
          console.log('error', error);
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
    });
    this.moduleForm = this.formBuilder.group({
      name: [[], Validators.required]
    });
  }
  selectPackage(data: any) {
    this.selectedPackage = data;
  }
  get orgForm() { return this.organizationForm.controls; }
  get modForm() { return this.moduleForm.controls; }

  registerOrginazation() {
    if (this.organizationForm.invalid || this.moduleForm.invalid) {
      return;
    } else {

    }
  }


}
