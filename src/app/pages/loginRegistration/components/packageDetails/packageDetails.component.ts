import {Component, OnInit, OnDestroy} from '@angular/core';
import {LoginRegistrationService} from 'src/app/pages/loginRegistration/services/LoginRegistrationService';
import {HelperService} from 'src/app/shared/helperService/helper.service';
import {Packages} from 'src/app/models/loginRegistration/packageDetails.model';
import {CompilerProvider} from '../../../../shared/compiler/compiler';
import {NavigationService} from '../../../navigation/services/navigation.service';
import {CoreService} from '../../../../core/services/authorization/core.service';

@Component({
  selector: 'app-org-registration-modal',
  templateUrl: './packageDetails.component.html',
  styleUrls: ['./packageDetails.component.scss']
})
export class PackageDetailsComponent implements OnInit, OnDestroy {

  packages: Packages[] = [];
  logoutDisable: boolean = false;
  logoutResponse;

  constructor(private loginRegisterService: LoginRegistrationService,
              private navService: NavigationService,
              public coreService: CoreService,
              public helperService: HelperService) {
  }

  ngOnInit() {
    this.loginRegisterService.getPackagesData().subscribe((res) => {
      this.packages = CompilerProvider.constructPackageDetail(res);
      this.packages = this.helperService.sortBy(this.packages, function (pkg) {
        return pkg.package.cost;
      });
      this.packages.splice(0, 1);
    });
  }

  logoutUser() {
    this.navService.logoutUser().subscribe((res) => {
      this.logoutDisable = true;
      this.logoutResponse = res;
      if (this.logoutResponse.detail === this.helperService.translated.AUTH.LOGOUTSUCCESSION) {
        this.coreService.logoutUser();
      }
    }, (error) => {
      this.helperService.createSnack(this.helperService.translated.MESSAGES.LOGOUT_FAIL_MSG,
        this.helperService.translated.MESSAGES.LOGOUT_FAIL_MSG, this.helperService.translated.STATUS.ERROR);
    });
  }

  ngOnDestroy() {
  }
}
