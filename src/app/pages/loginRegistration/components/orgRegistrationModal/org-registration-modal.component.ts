import {Component, OnInit, OnDestroy} from '@angular/core';
import {packges} from 'src/app/models/user.model';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/shared/helperService/helper.service';

@Component({
  selector: 'app-org-registration-modal',
  templateUrl: './orgRegistration.component.html',
  styleUrls: ['./org-registration-modal.component.scss']
})
export class OrgRegistrationModalComponent implements OnInit, OnDestroy {
  loading: boolean;
  selectedPackage: any = {};
  packages: any;
  success: any;

  constructor(private register: LoginRegistrationService,
              public helperService: HelperService) {
  }

  ngOnInit() {
    this.register.registrationData()
      .subscribe(data => {
          this.packages = data[2];
        },
        error => {
        });
  }

  ngOnDestroy() {
  }

  /**
   * saves package against module
   * @param name name of the module
   * @param data selected package against module
   */
  selectPackage(name: string, data: packges) {
    this.selectedPackage[name] = data;
  }
}
